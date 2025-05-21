import React from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableRow,
    Button, CircularProgress, TableContainer, Paper,
    TablePagination, Box
} from '@mui/material';

const DEFAULT_COLUMNS = [
    { dataElementId: 'D707dj4Rpjz', displayName: 'Facility Name', width: 200 },
    //   { dataElementId: 'SVzSsDiZMN5', displayName: 'Registration Number', width: 150 },
    { dataElementId: 'ykwhsQQPVH0', displayName: 'Surname', width: 150 },
    { dataElementId: 'SReqZgQk0RY', displayName: 'Phone Number', width: 150 },
    { dataElementId: 'NVlLoMZbXIW', displayName: 'Email', width: 200 }
];

const RequestsTable = ({ onRowClick, onEditClick }) => {
    const [requests, setRequests] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [columns, setColumns] = React.useState(DEFAULT_COLUMNS);
    const [dataElements, setDataElements] = React.useState({});
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalRecords, setTotalRecords] = React.useState(0);

    const fetchData = async (pageNumber, pageSize) => {
        try {
            const authString = btoa('admin:5Am53808053@');

            // Fetch data elements (only once)
            if (Object.keys(dataElements).length === 0) {
                const dataElementsResponse = await fetch(
                    'https://qimsdev.5am.co.bw/qims/api/dataElements.json?paging=false',
                    { headers: { 'Authorization': `Basic ${authString}` } }
                );
                const dataElementsData = await dataElementsResponse.json();

                const elementsMap = {};
                dataElementsData.dataElements.forEach(de => {
                    elementsMap[de.id] = de.displayName;
                });
                setDataElements(elementsMap);
            }

            // Fetch requests with pagination
            const requestsResponse = await fetch(
                `https://qimsdev.5am.co.bw/qims/api/40/tracker/events.json?page=${pageNumber + 1}&pageSize=${pageSize}&fields=dataValues%2CoccurredAt%2Cevent%2Cstatus%2CorgUnit%2Cprogram%2CprogramType%2CupdatedAt%2CcreatedAt%2CassignedUser%2C&program=Y4W5qIKlOsh&orgUnit=OVpBNoteQ2Y&programStage=YzqtE5Uv8Qd&ouMode=SELECTED&order=occurredAt%3Adesc`,
                { headers: { 'Authorization': `Basic ${authString}` } }
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

    // Update column display names
    React.useEffect(() => {
        if (Object.keys(dataElements).length > 0) {
            setColumns(prevColumns =>
                prevColumns.map(col => ({
                    ...col,
                    displayName: dataElements[col.dataElementId] || col.displayName
                }))
            );
        }
    }, [dataElements]);

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
                            <TableCell sx={{
                                width: 100,
                                fontWeight: 'bold',
                                paddingLeft: '16px',
                                borderRight: '1px solid rgba(224, 224, 224, 0.5)'
                            }}>
                                Date
                            </TableCell>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.dataElementId}
                                    sx={{
                                        minWidth: column.minWidth,
                                        fontWeight: 'bold',
                                        paddingLeft: '16px',
                                        whiteSpace: 'nowrap',
                                        borderRight: '1px solid rgba(224, 224, 224, 0.5)'
                                    }}
                                >
                                    {column.displayName}
                                </TableCell>
                            ))}
                            <TableCell sx={{
                                width: 100,
                                fontWeight: 'bold',
                                paddingLeft: '16px'
                            }}>
                                Status
                            </TableCell>
                            <TableCell sx={{
                                width: 100,
                                fontWeight: 'bold',
                                paddingLeft: '16px'
                            }}>
                                Accepted
                            </TableCell>
                            <TableCell sx={{
                                width: 100,
                                fontWeight: 'bold',
                                paddingLeft: '16px'
                            }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow
                                key={request.event}
                                hover
                                onClick={() => onRowClick(request)}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: 'action.hover' },
                                    '& td': {
                                        paddingLeft: '16px',
                                        borderRight: '1px solid rgba(224, 224, 224, 0.3)'
                                    }
                                }}
                            >
                                <TableCell sx={{
                                    whiteSpace: 'nowrap',
                                    paddingLeft: '16px'
                                }}>
                                    {new Date(request.occurredAt).toLocaleDateString()}
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell
                                        key={`${request.event}-${column.dataElementId}`}
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            paddingLeft: '16px'
                                        }}
                                    >
                                        {request.dataValues.find(dv => dv.dataElement === column.dataElementId)?.value || 'N/A'}
                                    </TableCell>
                                ))}
                                <TableCell sx={{
                                    textTransform: 'capitalize',
                                    paddingLeft: '16px'
                                }}>
                                    {request.status.toLowerCase()}
                                </TableCell>
                                <TableCell sx={{ paddingLeft: '16px' }}>
                                    {request.dataValues.some(dv => dv.dataElement === 'jV5Y8XOfkgb') ? (
                                        <span style={{ color: 'green' }}>✓</span>
                                    ) : (
                                        <span style={{ color: 'red' }}>✗</span>
                                    )}
                                </TableCell>
                                <TableCell sx={{ paddingLeft: '16px' }}>
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
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Keep your existing pagination code */}
        </Paper>
    );
};

export default RequestsTable;