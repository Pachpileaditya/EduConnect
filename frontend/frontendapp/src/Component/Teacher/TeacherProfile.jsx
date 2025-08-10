import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  Edit,
  Email,
  Cake,
  Person,
  LocationOn,
  LocalPostOffice,
  Map,
  EmojiEvents,
  Star,
} from "@mui/icons-material";
import Navbar from "../comman/Navbar";
import Sidebar from "../comman/Sidebar";

const TeacherProfile = () => {
  const theme = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [token, setToken] = useState("");
  const [teacherId, setTeacherId] = useState(null);

  // First effect: Get token and ID from localStorage
  useEffect(() => {
    const tok = localStorage.getItem("token");
    const techId = localStorage.getItem("id");

    if (techId && tok) {
      setTeacherId(techId);
      setToken(tok);
    }
  }, []);

  // Second effect: Fetch profile once teacherId and token are available
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/teachers/profile/${teacherId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (teacherId && token) {
      fetchProfile();
    }
  }, [teacherId, token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" mt={2} align="center">
        {error}
      </Typography>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="d-flex">
      <Sidebar/>

      <Card elevation={3} sx={{ borderRadius: 2 , flex: 1}}>
        <CardHeader
          avatar={
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: theme.palette.primary.main,
                fontSize: "1.75rem",
              }}
            >
              {profile.name.charAt(0)}
            </Avatar>
          }
          action={
            <IconButton aria-label="edit" color="primary">
              <Edit />
            </IconButton>
          }
          title={
            <Typography variant="h5" component="div" fontWeight="bold">
              {profile.name}
            </Typography>
          }
          subheader={
            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
              <Email fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body1" color="text.secondary">
                {profile.email}
              </Typography>
            </Box>
          }
          sx={{ pb: 0 }}
        />

        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              p: 1,
              backgroundColor: theme.palette.primary.light,
              borderRadius: 1,
              color: theme.palette.primary.contrastText,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", flexGrow: 1 }}
            >
              {profile.role}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Star sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                {profile.totalPoints} Points
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Personal Information
                </Typography>
                <DetailItem
                  icon={<Cake color="primary" />}
                  label="Date of Birth"
                  value={profile.dob}
                />
                <DetailItem
                  icon={<Person color="primary" />}
                  label="Gender"
                  value={profile.gender}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Contact Information
                </Typography>
                <DetailItem
                  icon={<LocationOn color="primary" />}
                  label="Address"
                  value={profile.address}
                />
                <DetailItem
                  icon={<LocalPostOffice color="primary" />}
                  label="Pincode"
                  value={profile.pincode}
                />
                <DetailItem
                  icon={<Map color="primary" />}
                  label="State"
                  value={profile.state}
                />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Expertise
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EmojiEvents color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">{profile.experties}</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
    <Box sx={{ mr: 2 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  </Box>
);

DetailItem.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default TeacherProfile;
