import React, { useState, useEffect } from 'react';
import {
    Box, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
    Paper, TableContainer, CircularProgress, TablePagination, IconButton, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';

const InspectionReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalReports, setTotalReports] = useState(0);

    // Fetch reports
    const fetchReports = async () => {
        try {
            setLoading(true);
            const url = new URL('http://localhost:5002/api/40/inspectionReports');
            url.searchParams.append('page', page + 1);
            url.searchParams.append('pageSize', rowsPerPage);
            if (searchTerm) {
                url.searchParams.append('query', searchTerm);
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': 'Basic ' + btoa('admin:district')
                }
            });

            if (!response.ok) throw new Error('Failed to fetch reports');

            const data = await response.json();
            setReports(data.reports || []);
            setTotalReports(data.pager?.total || 0);
        } catch (error) {
            console.error('Error fetching reports:', error);
            // Mock data for demonstration
            setReports([
                {
                    id: 'report1',
                    facility: 'Main Hospital',
                    section: 'Dentistry',
                    inspector: 'Inspector One',
                    date: '2023-06-18',
                    status: 'Completed',
                    score: '85%'
                }
            ]);
            setTotalReports(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [page, rowsPerPage, searchTerm]);

    const handleSearch = () => {
        setPage(0);
        fetchReports();
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const downloadReport = (reportId) => {
        // Implement download functionality
        console.log('Downloading report:', reportId);
        // This would typically link to a download endpoint
    };

    const viewReport = (reportId) => {
        // Implement view functionality
        console.log('Viewing report:', reportId);
        // This would open a modal or navigate to a report view page
    };

    return (
        <Box sx={{ p: 0 }}>
            {/* Search Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TextField
                    label="Search reports"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ minWidth: 300 }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                >
                    Search
                </Button>
            </Box>

            {/* Reports Table */}
            {loading ? (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper elevation={3} sx={{ borderRadius: 2 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Facility</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Section</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Inspector</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Score</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reports.map((report) => (
                                    <TableRow key={report.id} hover>
                                        <TableCell>{report.facility}</TableCell>
                                        <TableCell>{report.section}</TableCell>
                                        <TableCell>{report.inspector}</TableCell>
                                        <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Box
                                                component="span"
                                                sx={{
                                                    color: report.status === 'Completed' ? 'success.main' : 'warning.main',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {report.status}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{report.score}</TableCell>

                                        <TableCell>
                                            <Tooltip title="View Report" arrow>
                                                <IconButton onClick={() => viewReport(report.id)}>
                                                    <VisibilityIcon color="primary" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Download Report" arrow>
                                                <IconButton onClick={() => downloadReport(report.id)}>
                                                    <DownloadIcon color="secondary" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={totalReports}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            )}
        </Box>
    );
};

export default InspectionReports;