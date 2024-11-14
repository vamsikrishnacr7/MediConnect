import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Container, Grid, Card, Typography, Paper } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';

// Register chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dboard = ({ username, id }) => {
  const [userData, setUserData] = useState(null);
  const [wellnessStatus, setWellnessStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // Function to calculate wellness status
  const calculateWellnessStatus = (mindfulness, engagement, happiness) => {
    const average = (mindfulness + engagement + happiness) / 3;
    if (average >= 80) return 'Excellent';
    if (average >= 60) return 'Good';
    if (average >= 40) return 'Moderate';
    return 'Needs Attention';
  };

  // Fetch user data using `id`
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`);
        const data = response.data;

        // Set user data
        setUserData(data);

        // Calculate and set wellness status
        const { mindfulnessLevel, engagementLevel, happinessLevel } = data;
        setWellnessStatus(calculateWellnessStatus(mindfulnessLevel, engagementLevel, happinessLevel));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
        setUserData(null);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  // Prepare data for charts
  const { mindfulnessLevel, engagementLevel, happinessLevel, interactions } = userData;
  const { comments, likedPosts } = interactions;

  // Bar chart data
  const barData = {
    labels: ['Mindfulness', 'Engagement', 'Happiness'],
    datasets: [
      {
        label: 'Levels',
        data: [mindfulnessLevel, engagementLevel, happinessLevel],
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
        borderColor: ['#388e3c', '#1976d2', '#f57c00'],
        borderWidth: 1,
      },
    ],
  };

  // Pie chart data for wellness status
  const pieData = {
    labels: ['Excellent', 'Good', 'Moderate', 'Needs Attention'],
    datasets: [
      {
        data: [
          wellnessStatus === 'Excellent' ? 1 : 0,
          wellnessStatus === 'Good' ? 1 : 0,
          wellnessStatus === 'Moderate' ? 1 : 0,
          wellnessStatus === 'Needs Attention' ? 1 : 0,
        ],
        backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#dc3545'],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  // Additional metrics for user activity
  const totalComments = comments.length;
  const totalLikedPosts = likedPosts.length;

  return (
    <Container>
      <Grid container spacing={3}>
        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
              <Typography variant="h6">User Levels</Typography>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  plugins: {
                    title: { display: true, text: 'Mindfulness, Engagement & Happiness Levels' },
                  },
                }}
              />
            </Paper>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
              <Typography variant="h6">Wellness Status</Typography>
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  plugins: {
                    title: { display: true, text: 'Overall Wellness Status' },
                  },
                }}
              />
              <Typography variant="h5" sx={{ marginTop: 2 }}>Status: {wellnessStatus}</Typography>
            </Paper>
          </Card>
        </Grid>

        {/* Additional User Activity Metrics */}
        <Grid item xs={12}>
          <Card>
            <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
              <Typography variant="h6">User Activity Metrics</Typography>
              <Typography>Total Comments: {totalComments}</Typography>
              <Typography>Total Liked Posts: {totalLikedPosts}</Typography>
            </Paper>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dboard;