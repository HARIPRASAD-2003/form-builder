import React from 'react';
import {
    Container, Typography, Card, CardContent,
    Button, Box
} from '@mui/material';
import Grid, { GridProps } from '@mui/material/Grid';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetForm, setFormMeta } from '../redux/formSlice';
import { addField } from '../redux/formSlice';

const MyForms = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const savedForms = JSON.parse(localStorage.getItem('forms') || '[]');

    const handleLoadForm = (form: any) => {
        dispatch(resetForm());
        dispatch(setFormMeta(form.formName));
        form.fields.forEach((f: any) => dispatch(addField(f)));
        navigate('/preview');
    };

    return (
        <Container>
            <Typography variant="h4" mt={3} mb={2}>My Saved Forms</Typography>

            {savedForms.length === 0 ? (
                <Typography>No forms saved yet.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {savedForms.map((form: any, idx: number) => (
                        <Grid {...({ item: true, xs: 12, md: 6 } as GridProps)} key={idx}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{form.formName}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Saved on: {new Date(form.timestamp).toLocaleString()}
                                    </Typography>
                                    <Box mt={2}>
                                        <Button variant="contained" onClick={() => handleLoadForm(form)}>
                                            Preview
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default MyForms;
