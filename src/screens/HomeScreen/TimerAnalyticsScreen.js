import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { auth, firestore } from '../../../firebase';
import { LineChart } from 'react-native-chart-kit';
import { Card, ActivityIndicator } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import { FontAwesome5 } from '@expo/vector-icons';
import { useStreak } from 'use-streak';
import { startOfWeek, format, subDays, isSameDay } from 'date-fns';

const TimerAnalyticsScreen = () => {
  const [overallStats, setOverallStats] = useState({});
  const [focusChartData, setFocusChartData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const hours = Math.floor(overallStats.totalWorkDuration / 60);
  const minutes = overallStats.totalWorkDuration % 60;
  const [streakCount, setStreakCount] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [mostProductiveDay, setMostProductiveDay] = useState('');
  const [mostProductiveHrs, setMostProductiveHrs] = useState(0);

  const calculateStreaks = (dateData) => {
    let streakCount = 0;
    let currentStreak = 1;
  
    const sortedData = Object.keys(dateData)
      .map((date) => new Date(date))
      .sort((a, b) => a - b);
  
    for (let i = sortedData.length - 1; i >= 0; i--) {
      const currentDate = sortedData[i];
      const previousDate = sortedData[i - 1];
  
      if (previousDate && isConsecutiveDates(currentDate, previousDate)) {
        currentStreak++;
      } else {
        streakCount = Math.max(streakCount, currentStreak);
        currentStreak = 1;
        break;
      }
    }
    return streakCount;
  };
  
  

  const isConsecutiveDates = (currentDate, previousDate) => {
    const currentDay = new Date(currentDate).getDay();
    const previousDay = new Date(previousDate).getDay();
    // console.log(currentDate);
    // console.log(previousDate);
    // console.log(currentDay);

    return currentDay === previousDay + 1 || (previousDay === 6 && currentDay === 0);
  };

  const calculateLongestStreak = (dateData) => {
    let longestStreak = 0;
    let currentStreak = 0;

    const sortedDates = Object.keys(dateData).sort();

    sortedDates.forEach((date, index) => {
      const currentDate = new Date(date);
      const previousDate = index > 0 ? new Date(sortedDates[index - 1]) : null;

      if (previousDate && isConsecutiveDates(currentDate, previousDate)) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    });

    return longestStreak;
  };

  const calculateMostProductiveDay = (dateData) => {
    const focusData = [];
  
    for (const date in dateData) {
      focusData.push({
        date,
        focusTime: dateData[date].totalWorkDuration,
      });
    }
  
    const sortedData = focusData.sort((a, b) => b.focusTime - a.focusTime);
  
    if (sortedData.length > 0) {
      const mostProductiveDate = new Date(sortedData[0].date);
      return format(mostProductiveDate, 'dd MMMM yyyy'); // Format the date as "dd MMMM yyyy"
    }
  
    return '';
  };

  const calculateMostProductiveDayHrs = (dateData) => {
    const focusData = [];
  
    for (const date in dateData) {
      focusData.push({
        date,
        focusTime: dateData[date].totalWorkDuration,
      });
    }
  
    const sortedData = focusData.sort((a, b) => b.focusTime - a.focusTime);
    
    if (sortedData.length > 0) {
      console.log(sortedData[0])
      return sortedData[0].focusTime;
    }
  
    return 0;
  };

  useEffect(() => {
    // Retrieve the timer data from Firestore
    const fetchTimerData = async () => {
      try {
        const userId = auth.currentUser.uid;
        const userDoc = await firestore.collection('pomodoro').doc(userId).get();

        if (userDoc.exists) {
          const dateData = userDoc.data();

          const timerData = [];
          for (const date in dateData) {
            timerData.push(dateData[date]);
          }

          // Calculate overall statistics
          const overallData = calculateOverallStats(timerData);
          setOverallStats(overallData);

          // Prepare focus chart data
          const focusData = prepareFocusChartData(dateData);
          setFocusChartData(focusData);

          const streakCount = calculateStreaks(dateData);
          setStreakCount(streakCount);

          const longestStreak = calculateLongestStreak(dateData);
          setLongestStreak(longestStreak);

          const mostProductiveDay = calculateMostProductiveDay(dateData);
          setMostProductiveDay(mostProductiveDay);

          const mostProductiveDayhrs = calculateMostProductiveDayHrs(dateData);
          setMostProductiveHrs(mostProductiveDayhrs);
        }
      } catch (error) {
        console.error('Error retrieving timer data:', error);
      } finally {
        setLoading(false); // Set loading to false after data retrieval
      }
    };
    fetchTimerData();
  }, []);

  const calculateOverallStats = (timerData) => {
    console.log('timerData:', timerData);

    const totalWorkDuration = timerData.reduce((total, data) => {
      if (!isNaN(data.totalWorkDuration)) {
        return total + data.totalWorkDuration;
      }
      return total;
    }, 0);
    console.log('totalWorkDuration:', totalWorkDuration);

    const totalBreakDuration = timerData.reduce((total, data) => {
      if (!isNaN(data.totalBreakDuration)) {
        return total + data.totalBreakDuration;
      }
      return total;
    }, 0);
    console.log('totalBreakDuration:', totalBreakDuration);

    return {
      totalWorkDuration,
      totalBreakDuration,
    };
  };

  const prepareFocusChartData = (dateData) => {
    const focusChartData = Object.keys(dateData).map((date) => {
      const { totalWorkDuration } = dateData[date];
      const dayOfWeek = new Date(date).getDay();
      const weekday = weekdays[dayOfWeek];
      return { date, weekday, totalFocusTime: parseFloat(totalWorkDuration) || 0 };
    });

    // Sort the focusChartData array by date in ascending order
    focusChartData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Group the data by week
    const weeklyData = [];
    let currentWeekStart = null;
    let currentWeekData = [];

    focusChartData.forEach((data) => {
      const { date, weekday, totalFocusTime } = data;
      const weekStart = startOfWeek(new Date(date), { weekStartsOn: 0 });

      if (!currentWeekStart || weekStart.getTime() !== currentWeekStart.getTime()) {
        if (currentWeekData.length > 0) {
          weeklyData.push(currentWeekData);
        }
        currentWeekStart = weekStart;
        currentWeekData = [];
      }

      currentWeekData.push({ date, weekday, totalFocusTime });
    });

    if (currentWeekData.length > 0) {
      weeklyData.push(currentWeekData);
    }

    return weeklyData.reverse(); // Reverse the order of the weeklyData array
  };

  // Update the current week index when sliding
  const handleSlideChange = (index) => {
    setCurrentWeekIndex(index);
  };

  const renderWeekInsights = () => {
    if (focusChartData.length === 0) {
      return null;
    }

    const currentWeekData = focusChartData[currentWeekIndex];
    const startDate = currentWeekData[0].date;
    const endDate = currentWeekData[currentWeekData.length - 1].date;
    const weekStart = format(new Date(startDate), 'dd MMMM yyyy');
    const weekEnd = format(new Date(endDate), 'dd MMMM yyyy');
    const weekRangeText = `${weekStart} - ${weekEnd}`;

    return (
      <View style={styles.weekInsightsContainer}>
        <Text style={styles.weekInsightsText}>{weekRangeText}</Text>
      </View>
    );
  };

  const renderChart = () => {
    if (focusChartData.length === 0) {
      return null;
    }

    const currentWeekData = focusChartData[currentWeekIndex];
    const chartData = currentWeekData.map((data) => ({
      label: data.weekday.slice(0, 3),
      value: data.totalFocusTime,
    }));

    // Calculate average focus time for the entire week
    const averageFocusTime =
      chartData.reduce((sum, data) => sum + data.value, 0) / chartData.length;

    const averageLineData = chartData.map(() => averageFocusTime);

    return (
      <LineChart
        data={{
          labels: chartData.map((data) => data.label),
          datasets: [
            {
              data: chartData.map((data) => data.value),
            },
            {
              data: averageLineData,
              color: () => `rgba(0, 0, 0, 1)`, // Set the color to fully opaque black
              strokeWidth: 8, // Set the stroke width to make the line thicker
            },
          ],
        }}
        width={Dimensions.get('window').width * 0.88}
        height={250}
        yAxisSuffix="mins"
        chartConfig={{
          backgroundColor: '#478C5C',
          backgroundGradientFrom: '#478C5C',
          backgroundGradientTo: '#478C5C',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          propsForBackgroundLines: {
            strokeDasharray: '', // remove dotted lines
          },
          propsForDots: {
            r: '4',
          },
        }}
        bezier
        style={styles.chartStyle}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.streakContainer}>
        <Text style={styles.streakText}>Current Streak: {streakCount}</Text>
        <FontAwesome5 name="fire" size={25} color="orange" />
      </View>
      <View style={styles.chartContainer}>
        <Swiper loop={false} showsPagination={false} onIndexChanged={handleSlideChange}>
          {focusChartData.map((weekData, index) => (
            <View key={index} style={styles.contentContainerStyle}>
              <Card style={styles.cardContainer}>
                <Card.Content>
                  <Text style={styles.cardTitle}>Focus Time</Text>
                  {renderWeekInsights()}
                  {renderChart()}
                </Card.Content>
              </Card>
            </View>
          ))}
        </Swiper>
      </View>
      <View style={styles.bottomContainer}>
        <Card style={styles.cardSecondContainer}>
          <Card.Content>
            <Text style={styles.cardSecondTitle}>Overall Statistics</Text>
            <Text style={styles.cardText}>
              Total Focus Time: {hours} hrs {minutes} mins
            </Text>
            <Text style={styles.cardText}>
              Focus/Break Ratio: {(overallStats.totalWorkDuration / overallStats.totalBreakDuration).toFixed(2)}
            </Text>
            <Text style={styles.cardText}>Most Productive Date: {mostProductiveDay}</Text>
            <Text style={styles.cardText}>Longest Work Duration: {mostProductiveHrs} mins</Text>
            <View style={styles.longestStreakContainer}>
              <Text style={[styles.cardText, { marginRight: 5 }]}>Longest Streak: {longestStreak}</Text>
              <FontAwesome5 name="fire" size={25} color="orange" />
            </View>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#013A20',
  },
  chartContainer: {
    flex: 3,
  },
  cardTitle: {
    fontFamily: 'popBold',
    fontSize: 22,
    marginBottom: 15,
    color: '#FFFFFF',
  },
  cardSecondTitle: {
    fontFamily: 'popBold',
    fontSize: 22,
    marginBottom: 10,
    color: '#478C5C',
    textAlign: 'center',
  },
  cardText: {
    fontFamily: 'popMedium',
    fontSize: 14,
    marginTop: 5,
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: '#478C5C',
    width: '95%',
    borderRadius: 16,
    marginBottom: 20,
  },
  cardSecondContainer: {
    backgroundColor: '#E8FEEE',
    width: '95%',
    borderRadius: 16,
    marginBottom: 20,
  },
  weekInsightsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  weekInsightsText: {
    fontFamily: 'popMedium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  chartStyle: {
    borderRadius: 16,
    marginBottom: 30,
  },
  streakContainer: {
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  longestStreakContainer: {
    flexDirection: 'row',
  },
  streakText: {
    fontFamily: 'popMedium',
    fontSize: 18,
    marginRight: 7,
    color: '#478C5C',
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    marginBottom: 150,
    alignItems: 'center',
  },
});

export default TimerAnalyticsScreen;
