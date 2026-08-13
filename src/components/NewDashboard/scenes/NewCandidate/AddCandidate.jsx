import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../newComponents/Header";
import Sidebar from "../global/Sidebar";
import Topbar from "../global/Topbar";
import { ColorModeContext, useMode } from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import { useState } from "react";
import axios from "axios"
import { BASE_URL } from "../../../../helper";
import { useNavigate } from 'react-router-dom';


const AddCandidate = () => {
    const [theme, colorMode] = useMode();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const CreationSuccess = () => toast.success("Candidate Created Successfully \n Click Anywhere to exit this screen", {
        className: "toast-message",
    });
    const CreationFailed = () => toast.error("Invalid Details \n Please Try Again!", {
        className: "toast-message",
    });

    const [formData, setFormData] = useState({
        fullName: 'Kenneth AJA',
        matricNumber: 'COM/2026/001',
        department: 'Computer Science',
        position: 'President',
        manifesto: 'I am committed to advancing our university through innovation, technology, and student empowerment. Together we move forward to create a better future for all students.',
        campaignSlogan: 'We Move',
        photo: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({
            ...formData,
            [name]: files[0]
        });
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            const response = await axios.post(`${BASE_URL}/createCandidate`, formDataToSend);
            if (response.data.success) {
                CreationSuccess();
                setTimeout(() => {
                    navigate('/Candidate');
                }, 200)
            }
            else {
                CreationFailed()
            }
        }
        catch (error) {
            CreationFailed();
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    return (<ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="appNew">
                <Sidebar />
                <main className="content">
                    <Topbar />
                    <ToastContainer/>
                    <Box m="0px 20px">
                        <Header title="CREATE NEW CANDIDATE" subtitle="Create a New Candidate Profile" />
                        <br></br>

                        <form onSubmit={handleSubmit}>
                            <Box
                                display="grid"
                                gap="20px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Candidate Full Name"
                                    onChange={handleChange}
                                    value={formData.fullName}
                                    name="fullName"
                                    sx={{ gridColumn: "span 4" }}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Matric Number"
                                    onChange={handleChange}
                                    value={formData.matricNumber}
                                    name="matricNumber"
                                    sx={{ gridColumn: "span 2" }}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Department"
                                    onChange={handleChange}
                                    value={formData.department}
                                    name="department"
                                    sx={{ gridColumn: "span 2" }}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    select
                                    label="Position"
                                    onChange={handleChange}
                                    value={formData.position}
                                    name="position"
                                    sx={{ gridColumn: "span 4" }}
                                    required
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                    <option value="">Select Position</option>
                                    <option value="President">President</option>
                                    <option value="Vice President">Vice President</option>
                                    <option value="Secretary General">Secretary General</option>
                                    <option value="Assistant Secretary General">Assistant Secretary General</option>
                                    <option value="Treasurer">Treasurer</option>
                                    <option value="Financial Secretary">Financial Secretary</option>
                                    <option value="Director of Socials">Director of Socials</option>
                                    <option value="Director of Sports">Director of Sports</option>
                                    <option value="Director of Welfare">Director of Welfare</option>
                                    <option value="Public Relations Officer">Public Relations Officer</option>
                                    <option value="Women Affairs Commissioner">Women Affairs Commissioner</option>
                                    <option value="Student Senate Representative">Student Senate Representative</option>
                                </TextField>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    multiline
                                    rows={4}
                                    label="Manifesto"
                                    onChange={handleChange}
                                    value={formData.manifesto}
                                    name="manifesto"
                                    sx={{ gridColumn: "span 4" }}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Campaign Slogan"
                                    onChange={handleChange}
                                    value={formData.campaignSlogan}
                                    name="campaignSlogan"
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="file"
                                    label="Candidate Photo"
                                    onChange={handleFileChange}
                                    name="photo"
                                    sx={{ gridColumn: "span 4" }}
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <Box sx={{ gridColumn: "span 4", display: "flex", justifyContent: "flex-end" }}>
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        color="primary"
                                        disabled={loading}
                                        sx={{ mt: 2 }}
                                    >
                                        {loading ? 'Creating...' : 'Create Candidate'}
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </Box>
                </main>
            </div>
        </ThemeProvider>
    </ColorModeContext.Provider>
    )
}

export default AddCandidate;