import { Button } from "@mui/material";
import Grid  from "@mui/material/Grid2";
import { useState } from "react";
import ImportDialog from "../components/import-dialog";

const UploadCSV = () => {
  const [state, setState] = useState({
    openCsvImport: false,
  });

  const handleOpenImportDataset = () => {
    setState((prevState) => ({
      ...prevState,
      openCsvImport: !prevState.openCsvImport,
    }));
  };

  return (
    <>
      <Grid container justifyContent="center" alignItems="center">
        <Button variant="contained" onClick={handleOpenImportDataset}>
          Upload CSV
        </Button>
      </Grid>
      <ImportDialog
         open={state.openCsvImport}
         toggleOpen={handleOpenImportDataset}
       />
    </>
  )
}


export default UploadCSV;
