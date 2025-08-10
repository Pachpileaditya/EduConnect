import React, { useState } from "react";
import { 
  Card, CardContent, Typography, List, ListItem, ListItemText, 
  Button, Radio, RadioGroup, FormControlLabel, FormControl 
} from "@mui/material";
import Navbar from "../comman/Navbar";
import Sidebar from "../comman/Sidebar";
import { useNavigate } from "react-router-dom";

const SelectUnit = () => {
  const [selectedUnit, setSelectedUnit] = useState(""); // State to track selected unit
  const navigate = useNavigate()

  const units = [
    "Introduction to Database Management System",
    "SQL Basics",
    "SQL Functions",
    "SQL Joins",
    "Advanced SQL",
    "Distributed DB",
  ];

  const handleChange = (event) => {
    setSelectedUnit(event.target.value);
  };

  return (
    <div>

        <Navbar/>
        <hr />

        <div className="d-flex">
            <Sidebar/>
            <Card sx={{ maxWidth: 400, mx: "auto", my: 3, p: 2, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
                <Typography variant="h5" sx={{ mb: 2 }}>
                Select Unit:
                </Typography>
                <FormControl component="fieldset">
                <RadioGroup value={selectedUnit} onChange={handleChange}>
                    {units.map((unit, index) => (
                    <ListItem key={index} sx={{ borderBottom: "1px solid #ddd" }}>
                        <FormControlLabel 
                        value={unit} 
                        control={<Radio />} 
                        label={`${index + 1}. ${unit}`} 
                        />
                    </ListItem>
                    ))}
                </RadioGroup>
                </FormControl>
                <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }} 
                disabled={!selectedUnit} // Disable button if no unit is selected
                onClick={()=>navigate('/student-question-answer')}
                >
                Enter
                </Button>
            </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default SelectUnit;
