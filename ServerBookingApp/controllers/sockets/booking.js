module.exports = function (io) {
  io.of("/booking").on("connection", (socket) => {
    socket.on("find-a-driver", async (data) => {
      console.log(data);
    });
  });
};
