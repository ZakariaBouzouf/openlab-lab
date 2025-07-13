import { Button } from "@mui/material";
import Grid  from "@mui/material/Grid2";
import { useState } from "react";
import ImportDialog from "../components/import-dialog";
import CsvImporter from "../components/csv-importer";

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
        <CsvImporter/>
      </Grid>
      <ImportDialog
         open={state.openCsvImport}
         toggleOpen={handleOpenImportDataset}
       />
    </>
  )
}


export default UploadCSV;
