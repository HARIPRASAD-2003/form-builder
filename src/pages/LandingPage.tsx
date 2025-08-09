import React from "react";
import {
    Container,
    Box,
    Typography,
    Button,
    Card,
    CardContent
} from "@mui/material";
import { CheckCircle, Build, Preview, Functions, Save, Share } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const features = [
    { icon: <Build fontSize="large" />, title: "Drag & Drop Builder", desc: "Create forms effortlessly with our intuitive drag & drop interface." },
    { icon: <Preview fontSize="large" />, title: "Live Preview", desc: "See your form come to life instantly while editing." },
    { icon: <Functions fontSize="large" />, title: "Smart Formulas", desc: "Add calculations & derived fields using built-in formula helpers." },
    { icon: <Save fontSize="large" />, title: "Local Save", desc: "Save your work locally and edit anytime." },
];

export default function LandingPage() {

    const navigate = useNavigate();
    return (
        <Box>
            {/* Hero Section */}
            <Box sx={{ py: 8, textAlign: "center", background: "linear-gradient(135deg, #6c63ff, #ff6584)", color: "white" }}>
                <Typography variant="h2" fontWeight={700}>
                    🧩 Form Builder
                </Typography>
                <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
                    Build, Preview, and Share Forms – Smarter & Faster
                </Typography>
                <Button variant="contained" color="secondary" sx={{ mr: 2 }} onClick={() => navigate('/create')}>Try Now</Button>
                <Button variant="outlined" color="inherit">View Demo</Button>
            </Box>

            {/* Features Section */}
            <Container sx={{ py: 6 }}>
                <Typography variant="h4" fontWeight={600} textAlign="center" mb={4}>Key Features</Typography>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: 3
                    }}
                >
                    {features.map((f, idx) => (
                        <Card key={idx} sx={{ textAlign: "center", p: 2 }}>
                            <CardContent>
                                {f.icon}
                                <Typography variant="h6" fontWeight={600} sx={{ mt: 2 }}>{f.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Container>

            {/* How It Works */}
            <Box sx={{ py: 6, bgcolor: "#fafafa" }}>
                <Container>
                    <Typography variant="h4" fontWeight={600} textAlign="center" mb={4}>How It Works</Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: 3
                        }}
                    >
                        {[
                            "Create a new form from scratch or template.",
                            "Add and customize fields to your needs.",
                            "Use formulas for auto-calculation.",
                            "Save your form locally.",
                        ].map((step, i) => (
                            <Card key={i} sx={{ textAlign: "center", p: 2 }}>
                                <CardContent>
                                    <CheckCircle color="primary" fontSize="large" />
                                    <Typography variant="subtitle1" sx={{ mt: 2 }}>{step}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* Call to Action */}
            <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography variant="h5" mb={3}>Start building your forms now</Typography>
                <Button variant="contained" color="primary" size="large" onClick={()=>navigate('/create')}>Get Started</Button>
            </Box>

            {/* Footer */}
            <Box sx={{ py: 4, bgcolor: "#333", color: "white", textAlign: "center" }}>
                <Typography variant="body2">© {new Date().getFullYear()} Form Builder. All rights reserved.</Typography>
            </Box>
        </Box>
    );
}
