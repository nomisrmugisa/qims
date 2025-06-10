import PropTypes from 'prop-types';
// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// project imports
import Dot from 'components/@extended/Dot';

function createData(display_name, name, last_login, status) {
  return { display_name, name, last_login, status };
}

const rows = [
  createData('Aisha Nakato', 'aishak', '6/09/2025, 3:45:11 PM', 'Active'),
  createData('David Okello', 'dokello', '6/10/2025, 9:01:27 AM', 'Active'),
  createData('Emily Johnson', 'emily.j', '-', 'Disabled'),
  createData('Benjamin Carter', 'bcarter', '5/28/2025, 11:20:53 AM', 'Active'),
  createData('Olivia Martinez', 'omartinez', '-', 'Disabled'),
  createData('Liam Chen', 'liam_chen', '6/05/2025, 8:55:04 PM', 'Active'),
  createData('Sophia Williams', 'sophia.w', '-', 'Disabled'),
  createData('Jacob Goldstein', 'jgoldstein_admin', '6/10/2025, 11:30:00 AM', 'Active'),
  createData('Mia Rodriguez', 'mia.r', '-', 'Disabled'),
  createData('Ethan Kim', 'ethank', '5/12/2025, 7:18:41 AM', 'Active')
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'display_name',
    align: 'left',
    disablePadding: false,
    label: 'DISPLAY NAME'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'USERNAME'
  },
  {
    id: 'last_login',
    align: 'left',
    disablePadding: false,
    label: 'LAST LOGIN'
  },
  {
    id: 'status',
    align: 'left',
    disablePadding: false,
    label: 'STATUS'
  },
  {
    id: 'actions',
    align: 'right',
    disablePadding: false,
    label: 'ACTIONS'
  }
];

function UserTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {headCell.label}
            </Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function UserStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 'Active':
      color = 'success';
      title = 'Active';
      break;
    case 'Disabled':
      color = 'error';
      title = 'Disabled';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

export default function OrderTable() {
  const order = 'asc';
  const orderBy = 'display_name';

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <UserTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.display_name}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary">{row.display_name}</Link>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.last_login}</TableCell>
                  <TableCell>
                    <UserStatus status={row.status} />
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      variant="outlined" 
                      size="small"
                      color={row.status === 'Active' ? 'error' : 'success'}
                    >
                      {row.status === 'Active' ? 'Disable' : 'Enable'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

UserTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

UserStatus.propTypes = { status: PropTypes.string };