import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export default function DeletableChips( {handleDelete, name}: { handleDelete: () => any, name: string }) {

    return (
        <Stack sx={{ m: 2 }} direction="row" spacing={1}>
            <Chip label={name} onDelete={handleDelete} />
        </Stack>
    );
}