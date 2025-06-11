import {
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useCallback, useState, useEffect} from 'react';
import {globalStyles} from '../../styles/globalStyles';
import {appColors} from '../../constants/appColors';
import {RowComponent, TextComponent} from '../../components';
import {ArrowLeft, ArrowDown2} from 'iconsax-react-native';
import {fontFamilies} from '../../constants/fontFamilies';
import {useSelector} from 'react-redux';
import {RootState} from '../../stores/redux';
import {BarChart, PieChart} from 'react-native-gifted-charts';
import {apiAllBillDriver} from '../../apis';
import {IBill} from '../../models/BillModel';
import {useFocusEffect} from '@react-navigation/native';

const getMonthYear = (date: Date) =>
  `${date.getMonth() + 1}/${date.getFullYear()}`;

const Dashboard = ({navigation}: any) => {
  const {current} = useSelector((state: RootState) => state.user);

  const [dataHistory, setDataHistory] = useState<IBill[]>([]);
  const [dataRevenue, setDataRevenue] = useState<IBill[]>([]);
  const [chartData, setChartData] = useState<
    {value: number; label: string; fullLabel?: string}[]
  >([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [isWeeklyView, setIsWeeklyView] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [completedCount, setCompletedCount] = useState(0);
  const [pieMonth, setPieMonth] = useState<string | null>(null);
  const [showMonthModal, setShowMonthModal] = useState(false);

  const statusColors = {
    RECEIVED: '#4e73df',
    PENDING: '#f6c23e',
    COMPLETED: '#1cc88a',
    CANCELED: '#e74a3b',
  };

  // Lấy 6 tháng gần nhất (kể cả khi không có đơn)
  const now = new Date();
  const last6Months = Array.from({length: 6}, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return getMonthYear(date);
  }).reverse();
  const monthsWithOrders = last6Months;

  const pieData = [
    {
      value: Number(
        dataHistory.filter(
          bill =>
            bill.status === 'RECEIVED' &&
            (!pieMonth || getMonthYear(new Date(bill.createdAt)) === pieMonth),
        ).length,
      ),
      color: statusColors.RECEIVED,
      text: 'Received',
    },
    {
      value: Number(
        dataHistory.filter(
          bill =>
            bill.status === 'PENDING' &&
            (!pieMonth || getMonthYear(new Date(bill.createdAt)) === pieMonth),
        ).length,
      ),
      color: statusColors.PENDING,
      text: 'Pending',
    },
    {
      value: Number(
        dataHistory.filter(
          bill =>
            bill.status === 'COMPLETED' &&
            (!pieMonth || getMonthYear(new Date(bill.createdAt)) === pieMonth),
        ).length,
      ),
      color: statusColors.COMPLETED,
      text: 'Completed',
    },
    {
      value: Number(
        dataHistory.filter(
          bill =>
            bill.status === 'CANCELED' &&
            (!pieMonth || getMonthYear(new Date(bill.createdAt)) === pieMonth),
        ).length,
      ),
      color: statusColors.CANCELED,
      text: 'Canceled',
    },
  ];

  const isPieDataEmpty = pieData.every(item => item.value === 0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiAllBillDriver();
      const completedBills = response.data.filter(
        (bill: IBill) => bill.status === 'COMPLETED',
      );

      setDataRevenue(completedBills);
      setDataHistory(response.data);
      setCompletedCount(completedBills.length);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyRevenue = () => {
    const groupedData = dataRevenue.reduce(
      (acc: Record<string, number>, bill) => {
        const month = getMonthYear(new Date(bill.createdAt));
        if (!acc[month]) {
          acc[month] = 0;
        }
        acc[month] += bill.cost;
        return acc;
      },
      {},
    );

    const transformedData = last6Months.map(month => {
      const [m, y] = month.split('/');
      return {
        label: `T${m}/${y.slice(-2)}`,
        value: groupedData[month] || 0,
        fullLabel: month,
      };
    });

    setChartData(transformedData);
    setViewMode('month');
  };

  const calculateWeeklyRevenue = (month: string) => {
    setLoading(true);
    const [selectedMonth, selectedYear] = month.split('/').map(Number);

    const groupedData = dataRevenue.reduce(
      (acc: Record<string, number>, bill) => {
        const date = new Date(bill.createdAt);
        const billMonth = date.getMonth() + 1;
        const billYear = date.getFullYear();

        if (billMonth === selectedMonth && billYear === selectedYear) {
          const week = Math.ceil(date.getDate() / 7);
          const weekKey = `Week ${week}`;
          if (!acc[weekKey]) {
            acc[weekKey] = 0;
          }
          acc[weekKey] += bill.cost;
        }
        return acc;
      },
      {},
    );

    const totalWeeks = Math.ceil(
      new Date(selectedYear, selectedMonth, 0).getDate() / 7,
    );
    const allWeeks = Array.from(
      {length: totalWeeks},
      (_, i) => `Week ${i + 1}`,
    );

    const transformedData = allWeeks.map(week => ({
      label: `W${week.split(' ')[1]}`,
      value: groupedData[week] || 0,
      fullLabel: week,
    }));

    setChartData(transformedData);
    setIsWeeklyView(true);
    setViewMode('week');
    setLoading(false);
  };

  const calculateDailyRevenue = (week: string, month: string) => {
    setLoading(true);
    const [selectedMonth, selectedYear] = month.split('/').map(Number);
    const weekNumber = parseInt(week.split(' ')[1], 10);

    const groupedData = dataRevenue.reduce(
      (acc: Record<string, number>, bill) => {
        const date = new Date(bill.createdAt);
        const billMonth = date.getMonth() + 1;
        const billYear = date.getFullYear();

        if (billMonth === selectedMonth && billYear === selectedYear) {
          const week = Math.ceil(date.getDate() / 7);
          if (week === weekNumber) {
            const day = date.toLocaleDateString('en-US', {weekday: 'short'});

            if (!acc[day]) {
              acc[day] = 0;
            }
            acc[day] += bill.cost;
          }
        }
        return acc;
      },
      {},
    );

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const transformedData = daysOfWeek.map(day => ({
      label: day,
      value: groupedData[day] || 0,
    }));

    setChartData(transformedData);
    setIsWeeklyView(false);
    setViewMode('day');
    setLoading(false);
  };

  const getCurrentLabel = () => {
    const now = new Date();
    if (viewMode === 'month') {
      return `T${now.getMonth() + 1}/${now.getFullYear().toString().slice(-2)}`;
    }
    if (viewMode === 'week') {
      if (selectedMonth) {
        const [month, year] = selectedMonth.split('/').map(Number);
        if (now.getMonth() + 1 === month && now.getFullYear() === year) {
          const week = Math.ceil(now.getDate() / 7);
          return `W${week}`;
        }
      }
      return '';
    }
    if (viewMode === 'day') {
      if (selectedMonth && chartData.length > 0) {
        const [month, year] = selectedMonth.split('/').map(Number);
        const weekLabel = chartData[0].label;
        const week = Math.ceil(now.getDate() / 7);
        const selectedWeek = chartData.findIndex(
          item => item.label === weekLabel,
        );
        if (
          now.getMonth() + 1 === month &&
          now.getFullYear() === year &&
          week === parseInt(weekLabel.replace('W', ''), 10)
        ) {
          return now.toLocaleDateString('en-US', {weekday: 'long'});
        }
      }
      return '';
    }
    return '';
  };

  const currentLabel = getCurrentLabel();
  const coloredChartData = chartData.map(item => ({
    ...item,
    frontColor:
      item.label === currentLabel ? appColors.link : appColors.primary,
  }));

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  useEffect(() => {
    calculateMonthlyRevenue();
  }, [dataRevenue]);

  return (
    <View
      style={[
        globalStyles.container,
        {flex: 1, backgroundColor: appColors.gray6},
      ]}>
      <StatusBar barStyle={'light-content'} />
      <View style={[globalStyles.shadow, {height: 95, borderRadius: 20}]}>
        <View
          style={[
            globalStyles.shadow,
            {
              backgroundColor: appColors.primary,
              height: 85,
              width: '100%',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop:
                Platform.OS === 'android' ? StatusBar.currentHeight : 52,
            },
          ]}>
          <RowComponent justify="flex-start" styles={{flex: 1, marginLeft: 20}}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: 48,
                height: 48,
                justifyContent: 'center',
              }}>
              <ArrowLeft size={28} color={appColors.white} />
            </TouchableOpacity>
            <TextComponent
              flex={1}
              font={fontFamilies.semiBold}
              text="Statistical"
              title
              color={appColors.white}
            />
          </RowComponent>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 0,
        }}>
        {loading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 18, textAlign: 'center', marginTop: 50}}>
              Loading...
            </Text>
          </View>
        ) : (
          <>
            {/* 1. Time Range */}
            <RowComponent justify="space-between">
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  // marginBottom: 8,
                  gap: 10,
                }}>
                {viewMode === 'week' && (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      backgroundColor: appColors.primary,
                      borderRadius: 10,
                      shadowColor: appColors.primary,
                      shadowOpacity: 0.15,
                      shadowRadius: 8,
                      elevation: 4,
                      marginRight: 0,
                    }}
                    activeOpacity={0.85}
                    onPress={() => {
                      setSelectedMonth(null);
                      setSelectedWeek(null);
                      calculateMonthlyRevenue();
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 16,
                        letterSpacing: 0.5,
                      }}>
                      Back to Month
                    </Text>
                  </TouchableOpacity>
                )}
                {viewMode === 'day' && (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      backgroundColor: appColors.primary,
                      borderRadius: 10,
                      shadowColor: appColors.primary,
                      shadowOpacity: 0.15,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                    activeOpacity={0.85}
                    onPress={() => {
                      setSelectedWeek(null);
                      calculateWeeklyRevenue(selectedMonth!);
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 16,
                        letterSpacing: 0.5,
                      }}>
                      Back to Week
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={{
                    fontSize: 15,
                    color: appColors.text,
                    marginBottom: 6,
                    textAlign: 'right',
                    fontWeight: '600',
                  }}>
                  {viewMode === 'month' && chartData.length > 0
                    ? (() => {
                        const first = chartData[0].fullLabel?.split('/');
                        const last =
                          chartData[chartData.length - 1].fullLabel?.split('/');
                        return `${
                          first ? `${first[0].padStart(2, '0')}/01` : ''
                        } - ${
                          last ? `${last[0].padStart(2, '0')}/${last[1]}` : ''
                        }`;
                      })()
                    : viewMode === 'week' && selectedMonth
                    ? (() => {
                        const [m, y] = selectedMonth.split('/');
                        return `Month ${m}/${y}`;
                      })()
                    : viewMode === 'day' && selectedMonth && selectedWeek
                    ? (() => {
                        const [m, y] = selectedMonth.split('/');
                        return `Week ${selectedWeek} - Month ${m}/${y}`;
                      })()
                    : ''}
                </Text>

                {/* 2. Total money + orders */}
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    marginBottom: 2,
                    textAlign: 'right',
                    marginTop: 2,
                  }}>
                  {chartData
                    .reduce((sum, item) => sum + item.value, 0)
                    .toLocaleString('en-US')}
                  $
                  <Text
                    style={{
                      fontSize: 15,
                      color: appColors.text,
                      fontWeight: '400',
                    }}>
                    {' '}
                    (
                    {viewMode === 'month'
                      ? dataRevenue.filter(bill => {
                          // Lọc theo 6 tháng gần nhất
                          const billMonth = getMonthYear(
                            new Date(bill.createdAt),
                          );
                          return last6Months.includes(billMonth);
                        }).length
                      : viewMode === 'week' && selectedMonth
                      ? dataRevenue.filter(bill => {
                          // Lọc theo tháng đã chọn và tuần đã chọn
                          const billDate = new Date(bill.createdAt);
                          const billMonth = getMonthYear(billDate);

                          return billMonth === selectedMonth;
                        }).length
                      : viewMode === 'day' && selectedMonth && selectedWeek
                      ? dataRevenue.filter(bill => {
                          // Lọc theo ngày trong tuần đã chọn
                          const billDate = new Date(bill.createdAt);
                          const billMonth = getMonthYear(billDate);
                          const week = Math.ceil(billDate.getDate() / 7);
                          return (
                            billMonth === selectedMonth &&
                            week === Number(selectedWeek)
                          );
                        }).length
                      : 0}{' '}
                    orders)
                  </Text>
                </Text>
              </View>
            </RowComponent>

            {/* 3. Chart */}
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 14,
                paddingVertical: 18,
                paddingHorizontal: 10,
                marginTop: 18,
                marginBottom: 18,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.04,
                shadowRadius: 6,
                elevation: 2,
              }}>
              <BarChart
                data={coloredChartData}
                barWidth={38}
                barBorderRadius={6}
                yAxisThickness={0.5}
                xAxisThickness={0.5}
                minHeight={10}
                noOfSections={3}
                spacing={18}
                isAnimated={true}
                scrollToEnd={true}
                onPress={(item: {
                  label: string;
                  value: number;
                  fullLabel?: string;
                }) => {
                  if (viewMode === 'month') {
                    setSelectedMonth(item.fullLabel!);
                    setSelectedWeek(null);
                    calculateWeeklyRevenue(item.fullLabel!);
                  } else if (viewMode === 'week') {
                    const weekNumber = item.label.replace('W', '');
                    setSelectedWeek(weekNumber);
                    calculateDailyRevenue(`Week ${weekNumber}`, selectedMonth!);
                  }
                }}
              />
            </View>

            {/* 3.2 Month Selector */}
            <View style={{marginBottom: 10}}>
              <Text style={{fontWeight: 'bold', marginBottom: 4}}>
                Select month:
              </Text>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  width: 150,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between', // Thêm dòng này
                }}
                onPress={() => setShowMonthModal(true)}>
                <Text>{pieMonth || 'All'}</Text>
                <ArrowDown2 size={18} color="#888" /> {/* Thêm icon mũi tên */}
              </TouchableOpacity>
              {/* Modal chọn tháng */}
              <Modal
                visible={showMonthModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowMonthModal(false)}>
                <TouchableWithoutFeedback
                  onPress={() => setShowMonthModal(false)}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(0,0,0,0.25)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: '#fff',
                        borderRadius: 18,
                        paddingVertical: 20,
                        paddingHorizontal: 20,
                        width: 300,
                        maxWidth: '90%',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOpacity: 0.15,
                        shadowRadius: 16,
                        elevation: 8,
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 18,
                          marginBottom: 12,
                          color: appColors.primary,
                          textAlign: 'center',
                          letterSpacing: 0.5,
                        }}>
                        Select Month
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setPieMonth(null);
                          setShowMonthModal(false);
                        }}
                        style={{
                          paddingVertical: 10,
                          borderRadius: 8,
                          backgroundColor:
                            pieMonth === null ? appColors.primary : '#f5f5f5',
                          marginBottom: 4,
                          width: 200,
                          alignSelf: 'center',
                        }}>
                        <Text
                          style={{
                            color: pieMonth === null ? '#fff' : appColors.text,
                            fontWeight: pieMonth === null ? 'bold' : 'normal',
                            textAlign: 'center',
                            fontSize: 16,
                          }}>
                          All
                        </Text>
                      </TouchableOpacity>
                      <FlatList
                        data={monthsWithOrders}
                        keyExtractor={item => item}
                        style={{width: 200}}
                        renderItem={({item}) => (
                          <TouchableOpacity
                            onPress={() => {
                              setPieMonth(item);
                              setShowMonthModal(false);
                            }}
                            style={{
                              paddingVertical: 10,
                              borderRadius: 8,
                              backgroundColor:
                                pieMonth === item
                                  ? appColors.primary
                                  : '#f5f5f5',
                              marginBottom: 4,
                              width: 200,
                              alignSelf: 'center',
                            }}>
                            <Text
                              style={{
                                color:
                                  pieMonth === item ? '#fff' : appColors.text,
                                fontWeight:
                                  pieMonth === item ? 'bold' : 'normal',
                                textAlign: 'center',
                                fontSize: 16,
                              }}>
                              {item}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>

            {/* 3.1 Pie Chart for order status */}
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 14,
                paddingVertical: 18,
                paddingHorizontal: 10,
                marginBottom: 18,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.04,
                shadowRadius: 6,
                elevation: 2,
                justifyContent: 'center',
              }}>
              {/* Pie Chart bên trái */}
              {!isPieDataEmpty ? (
                <PieChart data={pieData} donut radius={60} innerRadius={36} />
              ) : (
                <Text
                  style={{
                    color: appColors.text,
                    fontStyle: 'italic',
                  }}>
                  No data for this month
                </Text>
              )}
              {/* Legend bên phải */}
              <View style={{marginLeft: 24}}>
                {pieData.map(item => (
                  <View
                    key={item.text}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <View
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: item.color,
                        marginRight: 8,
                      }}
                    />
                    <Text style={{fontSize: 15, color: '#222'}}>
                      {item.text} ({item.value})
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 4. Update info */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F5F5F5',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 12,
                marginBottom: 18,
              }}>
              <Text style={{fontSize: 13, color: appColors.text}}>
                Data updates every 30 minutes, last updated at 17:00.
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default Dashboard;
