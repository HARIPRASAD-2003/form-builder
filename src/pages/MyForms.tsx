import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetForm, setFormMeta, addField } from "../redux/formSlice";

interface SavedForm {
  formName: string;
  description: string;
  fields: any[];
  timestamp: string;
  thumbnail?: string;
}

const MyForms: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuFormIndex, setMenuFormIndex] = useState<number | null>(null);

  const savedForms: SavedForm[] = JSON.parse(localStorage.getItem("forms") || "[]");

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setMenuFormIndex(index);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuFormIndex(null);
  };

  const handlePreview = (form: SavedForm) => {
    dispatch(resetForm());
    dispatch(setFormMeta({ formName: form.formName, description: form.description }));
    form.fields.forEach((f) => dispatch(addField(f)));
    navigate("/preview");
  };

  const handleDelete = (index: number) => {
    const updated = savedForms.filter((_, i) => i !== index);
    localStorage.setItem("forms", JSON.stringify(updated));
    handleCloseMenu();
    window.location.reload();
  };

  const handleEdit = (form: SavedForm) => {
    dispatch(resetForm());
    dispatch(setFormMeta({ formName: form.formName, description: form.description }));
    form.fields.forEach((f) => dispatch(addField(f)));
    navigate("/create");
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" mb={3}>
        My Saved Forms
      </Typography>

      {savedForms.length === 0 ? (
        <Typography>No forms saved yet.</Typography>
      ) : (
        <Stack direction="row" flexWrap="wrap" gap={3}>
          {savedForms.map((form, idx) => (
            <Card
              key={idx}
              sx={{
                width: { xs: "100%", sm: "calc(50% - 12px)", md: "calc(33.33% - 16px)", lg: "calc(25% - 18px)" },
                borderRadius: 2,
                position: "relative",
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={
                //   form.thumbnail ||
                  "https://placehold.co/400x140/6c63ff/ffffff?text=Form+Preview&font=roboto"
                }
                alt={form.formName}
                onClick={() => handlePreview(form)}
                sx={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
              />
              <CardContent sx={{ pb: 6 }}>
                <Typography variant="subtitle1" noWrap>
                  {form.formName || "Untitled form"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {`Saved on: ${new Date(form.timestamp).toLocaleDateString()}`}
                </Typography>
              </CardContent>

              <IconButton
                sx={{ position: "absolute", top: 8, right: 8 }}
                onClick={(e) => handleOpenMenu(e, idx)}
              >
                <MoreVertIcon />
              </IconButton>
            </Card>
          ))}
        </Stack>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem
          onClick={() => {
            if (menuFormIndex !== null) handleEdit(savedForms[menuFormIndex]);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuFormIndex !== null) handleDelete(menuFormIndex);
          }}
        >
          Delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuFormIndex !== null) handlePreview(savedForms[menuFormIndex]);
          }}
        >
          Preview
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default MyForms;
