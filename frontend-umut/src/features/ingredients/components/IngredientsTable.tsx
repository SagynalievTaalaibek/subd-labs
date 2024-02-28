import React from 'react';
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { IngredientI } from '../../../types';

interface Props {
  ingredients: IngredientI[] | undefined;
  onDelete: (id: string) => void;
  deleteLoading: boolean | string;
}

const IngredientsTable: React.FC<Props> = ({ingredients, onDelete, deleteLoading}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Material Name</TableCell>
            <TableCell align="left">Quantity</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ingredients && ingredients.map((item, index) => (
            <TableRow
              key={item.id}
              sx={{'&:last-child td, &:last-child th': {border: 0}}}
            >
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell component="th" scope="row">
                {item.raw_material_name}
              </TableCell>
              <TableCell component="th" scope="row">
                {item.quantity}
              </TableCell>
              <TableCell component="th" scope="row">
                <Grid container spacing={2} alignContent="center">
                  <Grid item>
                    <Button
                      component={Link} variant="contained"
                      to={'/ingredients/update/' + item.id}
                    >
                      Update
                    </Button>
                  </Grid>
                  <Grid item>
                    <LoadingButton
                      type="submit"
                      color="error"
                      variant="contained"
                      disabled={deleteLoading ? deleteLoading === item.id : false}
                      loading={deleteLoading === item.id}
                      onClick={() => onDelete(item.id)}
                    >
                      Delete
                    </LoadingButton>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default IngredientsTable;