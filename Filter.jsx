import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  MenuItem,
  ListItem,
  IconButton,
  ListItemText,
  Button,
  TextInput,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
const operators = ['contain', '==', '>=', '<=', '!=', 'startWith', 'endWith'];
const filterFileds = {
  'Company Name': { operators },
  Category: { operators },
  Field: { operators },
  'Products Info': { operators },
  Country: { operators },
  Website: { operators },
  'Contact Person': { operators },
  Email: { operators },
  Telephone: { operators },
  'Rating (1-3)': {
    operators: operators.filter(
      (operator) => !['startWith', 'endWith', 'contain'].includes(operator)
    ),
  },
};

export default function Filter(props) {
  let { setRows, data } = props;
  const [filters, setFilters] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [combinator, setCombinator] = useState('and');
  const isMenuOpen = Boolean(anchorEl);
  console.log(data);
  function filterData(data, filter) {
    filter.value = filter.value.replace('\n', '');
    if (filter.operator === '==') {
      return data.filter(
        (row) => String(row[filter.field]) === String(filter.value)
      );
    } else if (filter.operator === 'contain') {
      return data.filter((row) =>
        row[filter.field].toLowerCase().includes(filter.value.toLowerCase())
      );
    } else if (filter.operator === 'endWith') {
      return data.filter((row) =>
        row[filter.field].toLowerCase().endsWith(filter.value.toLowerCase())
      );
    } else if (filter.operator === 'startWith') {
      return data.filter((row) =>
        row[filter.field].toLowerCase().endsWith(filter.value.toLowerCase())
      );
    } else if (filter.operator === '>=') {
      return data.filter(
        (row) =>
          row[filter.field] >=
          (+filter.value !== 0 ? (+filter.value ? +filter.value : 0) : 0)
      );
    } else if (filter.operator === '<=') {
      return data.filter(
        (row) =>
          row[filter.field] <=
          (+filter.value !== 0 ? (+filter.value ? +filter.value : 0) : 0)
      );
    } else if (filter.operator === '!=') {
      return data.filter(
        (row) =>
          row[filter.field] !=
          (+filter.value !== 0 ? (+filter.value ? +filter.value : 0) : 0)
      );
    }
  }
  useEffect(() => {
    console.log(filters);
    const validFilters = filters.filter((filter) => {
      return !!filter.operator && !!filter.field;
    });
    if (combinator === 'and') {
      console.log('validFilters', validFilters);

      validFilters.forEach((filter) => {
        data = filterData(data, filter);
      });
      setRows(data);
    } else {
      //combinator === or
    }
  }, [
    filters.reduce((acc, next) => {
      acc = acc + next.id + next.field + next.operator + next.value;
      return acc;
    }, ''),
    combinator,
  ]);
  function updateFilter(filterId, newFilter) {
    const newFilters = filters.map((filter) => {
      if (filter.id === filterId) {
        return newFilter;
      } else {
        return filter;
      }
    });
    setFilters(newFilters);
  }
  function openMenu(e) {
    setAnchorEl(e.currentTarget);
  }
  function closeMenu() {
    console.log('closeMenu');
    setAnchorEl(null);
  }
  function addFilter() {
    setFilters([...filters, { id: Date.now() }]);
  }
  function handleFilterDelete(e, id) {
    console.log(
      'delete',
      filters.filter((filter) => {
        return filter.id !== id;
      })
    );
    setFilters(
      filters.filter((filter) => {
        return filter.id !== id;
      })
    );
  }
  function combinatorChange(e) {
    setCombinator(e.target.value);
  }

  return (
    <React.Fragment>
      <IconButton onClick={openMenu}>
        <FilterAltIcon />
      </IconButton>
      <Menu
        sx={{
          '& .MuiPaper-root': {
            width: '400px',
            height: 'auto',
          },
        }}
        onClose={closeMenu}
        open={isMenuOpen}
        anchorEl={anchorEl}
      >
        <Button onClick={addFilter}>Add Filter</Button>
        <label for="combinator">Combinator</label>
        <select value={combinator} onChange={combinatorChange} id="combinator">
          <option value="and">And</option>
          <option value="or">Or </option>
        </select>
        {filters.map((filter) => {
          return (
            <FilterItem
              handleFilterDelete={handleFilterDelete}
              filterFileds={filterFileds}
              filter={filter}
              updateFilter={updateFilter}
            />
          );
        })}
      </Menu>
    </React.Fragment>
  );
}
function FilterItem({
  handleFilterDelete,
  filterFileds,
  updateFilter,
  filter,
}) {
  const [field, setField] = useState(filter.field || '');
  const [operator, setOperator] = useState(filter.operator || '');
  const [value, setValue] = useState(filter.value || '');
  const filedNames = Object.keys(filterFileds);
  function handleFilterFieldChange(e) {
    setField(e.target.value);
  }
  function operatorChange(e) {
    setOperator(e.target.value);
  }
  function valueChange(e) {
    setValue(e.target.value);
  }
  useEffect(() => {
    updateFilter(filter.id, { ...filter, operator, field, value });
  }, [operator, field, value]);
  return (
    <ListItem key={filter.id} sx={{ display: 'flex' }}>
      <select
        onChange={handleFilterFieldChange}
        value={filter.field || ''}
        style={{ width: '100px' }}
      >
        <option value="">Field</option>
        {filedNames.map((filter) => (
          <option key={filter}>{filter}</option>
        ))}
      </select>
      <select
        onChange={operatorChange}
        value={filter.operator || ''}
        style={{ width: '100px' }}
      >
        <option value="">Operator</option>
        {filterFileds[field]?.operators?.map((operator) => {
          return <option key={operator}>{operator}</option>;
        })}
      </select>
      <input
        value={filter.value || ''}
        onInput={valueChange}
        placeholder="search..."
        style={{ width: '100px' }}
      />

      <IconButton
        onClick={(e) => {
          handleFilterDelete(e, filter.id);
        }}
      >
        <ClearIcon />
      </IconButton>
    </ListItem>
  );
}
