import React from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableRow,
    Button, CircularProgress, TableContainer, Paper,
    TablePagination, Box
} from '@mui/material';

const RequestsTable = ({ onRowClick, onEditClick }) => {
    const [requests, setRequests] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalRecords, setTotalRecords] = React.useState(0);

    const fetchData = async (pageNumber, pageSize) => {
        try {
            console.log(`URL : ${process.env.REACT_APP_DHIS2_URL}`);

            const requestsResponse = await fetch(
                `${process.env.REACT_APP_DHIS2_URL}/api/40/tracker/events.json?page=${pageNumber + 1}&pageSize=${pageSize}&fields=dataValues%2CoccurredAt%2Cevent%2Cstatus%2CorgUnit%2Cprogram%2CprogramType%2CupdatedAt%2CcreatedAt%2CassignedUser%2C&program=Y4W5qIKlOsh&orgUnit=OVpBNoteQ2Y&programStage=YzqtE5Uv8Qd&ouMode=SELECTED&order=occurredAt%3Adesc`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );
            const requestsData = await requestsResponse.json();
            setRequests(requestsData.instances);
            setTotalRecords(requestsData.pager?.total || requestsData.instances.length);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData(page, rowsPerPage);
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
                    <TableHead sx={{ width: '1400px', marginLeft: '-20px' }}>
                        <TableRow>
                            <TableCell sx={{
                                width: 177,
                                fontWeight: 'bold',
                                marginLeft: '-10px',
                                paddingLeft: '16px',
                                borderRight: 'none'
                            }}>
                                Date
                            </TableCell>
                            <TableCell sx={{
                                width: 177,
                                fontWeight: 'bold',
                                marginLeft: '-13px',
                                paddingLeft: '16px',
                                borderRight: 'none'
                            }}>
                                Facility Name
                            </TableCell>
                            <TableCell sx={{
                                width: 177,
                                fontWeight: 'bold',
                                marginLeft: '-13px',
                                paddingLeft: '16px',
                                borderRight: 'none'
                            }}>
                                Surname
                            </TableCell>
                            <TableCell sx={{
                                width: 177,
                                fontWeight: 'bold',
                                marginLeft: '-14px',
                                paddingLeft: '16px',
                                borderRight: 'none'
                            }}>
                                Phone Number
                            </TableCell>
                            <TableCell sx={{
                                width: 177,
                                fontWeight: 'bold',
                                marginRight: '40px',
                                // paddingLeft: '16px',
                                borderRight: 'none'
                            }}>
                                Email Address
                            </TableCell>
                            <TableCell sx={{
                                width: 177,
                                fontWeight: 'bold',
                                marginLeft: '-16px',
                                paddingLeft: '16px',
                                borderRight: 'none'
                            }}>
                                Status
                            </TableCell>
                            <TableCell sx={{
                                width: 177,
                                fontWeight: 'bold',
                                // marginLeft: '-20px',
                                paddingRight: '46px',
                                borderRight: 'none'
                            }}>
                                Accepted
                            </TableCell>
                            {/* <TableCell sx={{
                                width: 177,
                                fontWeight: 'bold',
                                marginLeft: '-10px',
                                paddingLeft: '16px'
                            }}>
                                Actions
                            </TableCell>  */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow
                                key={request.event}
                                hover
                                // onClick={() => onRowClick(request)}
                                onClick={() => onEditClick(request)}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: 'action.hover' },
                                    '& td': {
                                        paddingLeft: '16px',
                                        borderRight: '1px solid rgba(224, 224, 224, 0.3)'
                                    }
                                }}
                            >
                                {/* Date of Request */}
                                <TableCell sx={{
                                    whiteSpace: 'nowrap',
                                    paddingLeft: '16px',
                                    width: 120
                                }}>
                                    {new Date(request.occurredAt).toLocaleDateString()}
                                </TableCell>

                                {/* Facility Name - D707dj4Rpjz */}
                                <TableCell sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    paddingLeft: '16px',
                                    width: 200
                                }}>
                                    {request.dataValues.find(dv => dv.dataElement === 'D707dj4Rpjz')?.value || 'N/A'}
                                </TableCell>

                                {/* Surname - ykwhsQQPVH0 */}
                                <TableCell sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    paddingLeft: '16px',
                                    width: 150
                                }}>
                                    {request.dataValues.find(dv => dv.dataElement === 'ykwhsQQPVH0')?.value || 'N/A'}
                                </TableCell>

                                {/* Phone Number - SReqZgQk0RY */}
                                <TableCell sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    paddingLeft: '16px',
                                    width: 150
                                }}>
                                    {request.dataValues.find(dv => dv.dataElement === 'SReqZgQk0RY')?.value || 'N/A'}
                                </TableCell>

                                {/* Email Address - NVlLoMZbXIW */}
                                <TableCell sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    paddingLeft: '16px',
                                    width: 200
                                }}>
                                    {request.dataValues.find(dv => dv.dataElement === 'NVlLoMZbXIW')?.value || 'N/A'}
                                </TableCell>

                                {/* Status */}
                                <TableCell sx={{
                                    textTransform: 'capitalize',
                                    paddingLeft: '16px',
                                    width: 100
                                }}>
                                    {/* {request.status.toLowerCase()} */}
                                    {request.status === 'COMPLETED' ? 'Completed' :
                                        request.status === 'ACTIVE' ? 'Active' :
                                            request.status.toLowerCase()}
                                </TableCell>

                                {/* Accepted */}
                                <TableCell sx={{
                                    paddingLeft: '16px',
                                    width: 100
                                }}>
                                    {request.dataValues.some(dv => dv.dataElement === 'jV5Y8XOfkgb')?.value === 'true' ? (
                                        <span style={{ color: 'green' }}>✓</span>
                                    ) : (
                                        <span style={{ color: 'red' }}>✗</span>
                                    )}
                                </TableCell>

                                {/* Actions */}
                                {/* <TableCell sx={{ 
                                    paddingLeft: '16px',
                                    width: 100
                                }}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditClick(request);
                                        }}
                                        sx={{ minWidth: 70 }}
                                    >
                                        Edit
                                    </Button>
                                </TableCell> */}
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

export default RequestsTable;