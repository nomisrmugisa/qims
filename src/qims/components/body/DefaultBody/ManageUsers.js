import React from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableRow,
    Button, CircularProgress, TableContainer, Paper,
    TablePagination, Box
} from '@mui/material';

const ManageUsers = () => {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalRecords, setTotalRecords] = React.useState(0);

    const fetchUsers = async (pageNumber, pageSize) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_DHIS2_URL}/api/40/users.json?page=${pageNumber + 1}&pageSize=${pageSize}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );
            const data = await response.json();
            setUsers(data.users);
            setTotalRecords(data.pager?.total || data.users.length);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchUsers(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading) return (
        <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
        </Box>
    );

    return (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                <Table stickyHeader size="small" sx={{ tableLayout: 'fixed' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                key={user.id}
                                hover
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: 'action.hover' },
                                    '& td': {
                                        paddingLeft: '16px',
                                        borderRight: '1px solid rgba(224, 224, 224, 0.3)'
                                    }
                                }}
                            >
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{`${user.firstName} ${user.surname}`}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phoneNumber}</TableCell>
                                <TableCell>
                                    {user.disabled ? (
                                        <span style={{ color: 'red' }}>Disabled</span>
                                    ) : (
                                        <span style={{ color: 'green' }}>Active</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{ minWidth: 70, mr: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color={user.disabled ? "success" : "error"}
                                        sx={{ minWidth: 70 }}
                                    >
                                        {user.disabled ? "Enable" : "Disable"}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[10, 15, 25]}
                component="div"
                count={totalRecords}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    borderTop: '1px solid rgba(224, 224, 224, 1)',
                    '& .MuiTablePagination-toolbar': {
                        paddingLeft: 2,
                    }
                }}
            />
        </Paper>
    );
};

export default ManageUsers; 