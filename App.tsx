import * as React from 'react';
import './style.css';
import { DataGrid } from '@mui/x-data-grid';
import 'react-filter-box/lib/react-filter-box.css';
import data from './data.json';
import ReactFilterBox, { SimpleResultProcessing } from 'react-filter-box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';

import {
  Chip,
  Menu,
  Paper,
  ListItem,
  ListItemText,
  Autocomplete,
  TextField,
} from '@mui/material';
import { styled, lighten, darken } from '@mui/system';
import { useReactTable } from '@tanstack/react-table';
import Filter from './Filter';
const headers = Object.keys({
  id: 1103,
  'Company Name': '',
  DOCS: '',
  Category: '',
  Field: '',
  'Products Info': '',
  Country: '',
  Website: '',
  'Contact Person': '',
  Email: '',
  Telephone: '',
  Mobile: '',
  Remarks: '',
  'Rating (1-3)': null,
});

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
}));
const GroupItems = styled('ul')({
  padding: 0,
});
const columns = headers.map((header) => ({
  field: header,
  headerName: header,
  width: 100,
}));
export default function App() {
  const [rows, setRows] = React.useState(data);
  const [filters, setFilters] = React.useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);

  return (
    <div style={{ height: '600px' }}>
      <Filter data={data} setRows={setRows} />
      <Autocomplete
        renderOption={(props, option, state) => (
          <TableRow {...props} {...state} {...option} key={option['id']}>
            {headers.map((header) => {
              return <TableCell key={option.id}>{option[header]}</TableCell>;
            })}
          </TableRow>
        )}
        getOptionLabel={(option) => option['Company Name']}
        id="combo-box-demo"
        multiple
        groupBy={(option) => true}
        onChange={(e) => console.log(e)}
        options={rows}
        renderGroup={(params) => {
          console.log('group', params.group);
          return (
            <li>
              <GroupHeader sx={{ background: 'white' }}>
                <TableHead sx={{ background: 'white' }}>
                  <TableRow>
                    {headers.map((header) => (
                      <TableCell>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
              </GroupHeader>
              <GroupItems>{params.children}</GroupItems>
            </li>
          );
        }}
        sx={{ width: '100%' }}
        renderInput={(params) => <TextField {...params} label="Movie" />}
      />
      {rows
        ?.filter((row) => selectionModel.includes(row.id))
        .map((row) => (
          <Chip
            key={row.id}
            label={row['Company Name']}
            onDelete={() => {
              setSelectionModel(
                selectionModel?.filter((selectionId) => {
                  return selectionId !== row.id;
                })
              );
            }}
          />
        ))}
      <DataGrid
        size="small"
        checkboxSelection
        onSelectionModelChange={(item) => setSelectionModel(item)}
        filterMode={'client'}
        rows={rows}
        columns={columns}
        pageSize={50}
        rowsPerPageOptions={[5]}
        selectionModel={selectionModel}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
}
