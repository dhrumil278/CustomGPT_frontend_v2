import React from 'react';
import { Box, IconButton, Divider } from '@mui/material';
import {
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatStrikethrough as StrikeIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as OrderedListIcon,
} from '@mui/icons-material';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        p: 1,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'grey.50',
      }}
    >
      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleBold().run()}
        sx={{
          color: editor.isActive('bold') ? 'primary.main' : 'text.secondary',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <BoldIcon fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        sx={{
          color: editor.isActive('italic') ? 'primary.main' : 'text.secondary',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <ItalicIcon fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        sx={{
          color: editor.isActive('strike') ? 'primary.main' : 'text.secondary',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <StrikeIcon fontSize="small" />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        sx={{
          color: editor.isActive('bulletList') ? 'primary.main' : 'text.secondary',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <BulletListIcon fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        sx={{
          color: editor.isActive('orderedList') ? 'primary.main' : 'text.secondary',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <OrderedListIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default MenuBar; 