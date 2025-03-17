const driverModel = require("../../models/driverModel");
const BillTemporary = require("../../models/billTemporaryModel");
const Bill = require("../../models/billModel");

module.exports = function (io) {
  io.of("/booking").on("connection", (socket) => {
    socket.on("find-driver", async (data) => {
      try {
        const drivers = await driverModel.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [
                  data.addressSelectedPickup.longitude,
                  data.addressSelectedPickup.latitude,
                ],
              },
              distanceField: "distance",
              spherical: true,
              maxDistance: 2000, // Giới hạn 5km (tuỳ chỉnh theo nhu cầu)
            },
          },
          {
            $match: { status: "online", travelMode: data.typeVehicleSelected },
          }, // Chỉ lấy tài xế online, kiểu xe
          { $limit: 10 }, // Giới hạn 10 tài xế gần nhất
          { $project: { _id: 0, socketId: 1 } }, // Chỉ lấy socketId
        ]);

        const socketIds = drivers.map((driver) => driver.socketId);

        console.log(socketIds);

        const newBillTemporary = new BillTemporary({
          pickupAddress: {
            main_name_place: data.addressSelectedPickup?.main_name_place,
            description: data.addressSelectedPickup?.description,
            latitude: data.addressSelectedPickup?.latitude,
            longitude: data.addressSelectedPickup?.longitude,
          },
          destinationAddress: {
            main_name_place: data.addressSelectedDestination?.main_name_place,
            description: data.addressSelectedDestination?.description,
            latitude: data.addressSelectedDestination?.latitude,
            longitude: data.addressSelectedDestination?.longitude,
          },
          distanceInKilometers: Math.ceil(data.totalDistance * 0.001),
          durationInMinutes: Math.ceil(
            data.totalDistance * 0.001 * data.averageTimeVehicleSelected
          ),
          // paymentMethod: data.paymentMethod,
          cost: Math.ceil(
            data.totalDistance * 0.001 * data.costVehicleSelected
          ),
          travelMode: data.typeVehicleSelected,
          userId: data.infCustomer._id, // Bắt buộc phải có, không đặt mặc định
          socketIdDriversReceived: socketIds,
        });

        await newBillTemporary.save();

        io.of("/booking")
          .to(socket.id)
          .emit("id-new-order", newBillTemporary._id);

        // console.log(newBillTemporary);

        // Emit thông báo đến từng tài xế trong danh sách
        socketIds.forEach((socketId) => {
          console.log(socketId);

          socket.to(socketId).emit("new-order", {
            ...newBillTemporary.toObject(), // Chuyển document Mongoose thành object JS
            infCustomer: {
              _id: data.infCustomer._id,
              firstname: data.infCustomer.firstname,
              lastname: data.infCustomer.lastname,
              mobile: data.infCustomer.mobile,
              email: data.infCustomer.email,
              socketId: data.infCustomer.socketId,
            },
          });
        });

        console.log("✅ Đã gửi yêu cầu đến tài xế thành công!");
      } catch (error) {
        console.error("❌ Lỗi khi tìm tài xế:", error);
      }
    });

    socket.on("notice-receipt-order", async (data) => {
      const bill = await BillTemporary.findById(data.idBillTemporary);

      bill.socketIdDriversReceived.forEach((socketId) => {
        io.of("/booking").to(socketId).emit("delete-received-order", bill._id);
      });

      const newBill = new Bill({
        pickupAddress: {
          main_name_place: bill.pickupAddress.main_name_place,
          description: bill.pickupAddress.description,
          latitude: bill.pickupAddress.latitude,
          longitude: bill.pickupAddress.longitude,
        },
        destinationAddress: {
          main_name_place: bill.destinationAddress.main_name_place,
          description: bill.destinationAddress.description,
          latitude: bill.destinationAddress.latitude,
          longitude: bill.destinationAddress.longitude,
        },
        distanceInKilometers: bill.distanceInKilometers,
        durationInMinutes: bill.durationInMinutes,
        paymentMethod: bill.paymentMethod,
        cost: bill.cost,
        travelMode: bill.travelMode,
        userId: bill.userId,
        driverId: data.infDriver._id, // Nếu không có driverId thì mặc định là null
      });

      await newBill.save();

      // Lấy thông tin của bill kèm thông tin driver
      const billOnlyDriver = await newBill.populate("driverId");

      const billWithDriver = {
        ...billOnlyDriver.toObject(),
        userId: bill.userId,
      };

      socket.to(data.socketIdCustomer).emit("notice-driver-receipted-order", {
        // infDriver: data.infDriver,
        billWithDriver,
      });

      // Lấy thông tin của bill kèm thông tin user
      const billOnlyUser = await newBill.populate("userId");

      const billWithUser = {
        ...billOnlyUser.toObject(),
        driverId: data.infDriver._id,
      };

      io.of("/booking").to(socket.id).emit("notice-driver-receipted-order", {
        // infDriver: data.infDriver,
        billWithUser,
      });

      await BillTemporary.findByIdAndDelete(data.idBillTemporary);
    });

    socket.on("send-location-to-customer", async (data) => {
      console.log(data);

      const bill = await Bill.findById(data.idOrder).populate({
        path: "userId",
        select: "socketId", // Chỉ lấy trường socketId từ user
      });

      socket
        .to(bill.userId.socketId)
        .emit(`location-driver-shipping-${bill._id}`, {
          locationDriver: data.locationDriver,
          // statusBill: bill.status,
        });
    });
    socket.on("notice-remove-order-from-user", async (data) => {
      const deletedBill = await BillTemporary.findByIdAndDelete(data).select(
        "socketIdDriversReceived"
      );

      deletedBill.socketIdDriversReceived.forEach((socketId) => {
        socket
          .to(socketId)
          .emit("notice-remove-order-from-user", deletedBill._id);
      });

      console.log("✅ Đã gửi yêu cầu đến tài xế thành công!");
    });

    socket.on("notice-cancle-order-from-driver", async (data) => {
      const updatedBill = await Bill.findByIdAndUpdate(
        data,
        { status: "COMPLETED" }, // Cập nhật trạng thái đơn hàng
        { new: true } // Trả về document đã cập nhật
      )
        .populate("userId", "socketId") // Lấy thông tin user
        .select("userId"); // Chỉ lấy userId và socketId

      if (updatedBill) {
        socket
          .to(updatedBill.userId.socketId)
          .emit("notice-complete-order-from-driver", updatedBill._id);

        console.log(
          "✅ Đã cập nhật trạng thái đơn hàng thành COMPLETE và thông báo đến user!"
        );
      } else {
        console.log("❌ Không tìm thấy đơn hàng hoặc cập nhật thất bại.");
      }
    });

    socket.on("notice-arrival-at-pick-up-point", async (data) => {
      const bill = await Bill.findById(data.idOrder).populate({
        path: "userId",
        select: "socketId", // Chỉ lấy trường socketId từ user
      });

      if (bill.socketId) {
        socket
          .to(bill.userId.socketId)
          .emit("notice-arrival-at-pick-up-point", bill._id);
      } else {
        console.log("❌ Không tìm thấy đơn hàng.");
      }
    });

    socket.on("notification-arrival-destination", async (data) => {
      const bill = await Bill.findById(data.idOrder).populate({
        path: "userId",
        select: "socketId", // Chỉ lấy trường socketId từ user
      });

      if (bill.socketId) {
        socket
          .to(bill.userId.socketId)
          .emit("notification-arrival-destination", bill._id);
      } else {
        console.log("❌ Không tìm thấy đơn hàng.");
      }
    });
  });
};
