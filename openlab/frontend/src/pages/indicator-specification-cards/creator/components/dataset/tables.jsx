import React, { useRef, useState, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";

const NotionLikeTable = () => {
  const hotRef = useRef(null);
  const [hoverRow, setHoverRow] = useState(null);
  const [hoverCol, setHoverCol] = useState(null);
  const [gridOffset, setGridOffset] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Get the position of the grid on the page
    if (hotRef.current) {
      const gridElement = hotRef.current.hotInstance.rootElement;
      const rect = gridElement.getBoundingClientRect();
      setGridOffset({ top: rect.top, left: rect.left });
    }
  }, []);

  const handleAddRow = (rowIndex) => {
    const hot = hotRef.current.hotInstance;
    hot.alter("insert_row", rowIndex + 1);
  };

  const handleAddCol = (colIndex) => {
    const hot = hotRef.current.hotInstance;
    hot.alter("insert_col", colIndex + 1);
  };

  const handleMouseMove = (event) => {
    if (hotRef.current) {
      const hot = hotRef.current.hotInstance;
      const coords = hot.getCoords(event.target);
      if (coords && coords.row >= 0) setHoverRow(coords.row);
      else setHoverRow(null);

      if (coords && coords.col >= 0) setHoverCol(coords.col);
      else setHoverCol(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverRow(null);
    setHoverCol(null);
  };

  return (
    <div
      style={{ position: "relative", height: "600px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <HotTable
        ref={hotRef}
        data={[
          ["Name", "Age", "Country"],
          ["Alice", 25, "Germany"],
          ["Bob", 30, "USA"],
        ]}
        colHeaders
        rowHeaders
        width="100%"
        height="100%"
        licenseKey="non-commercial-and-evaluation"
        manualRowResize
        manualColumnResize
        stretchH="all"
      />

      {/* Add Row Button */}
      {hoverRow !== null && (
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            left: "-30px",
            top: `${(hoverRow + 1) * 24}px`,
            transform: "translateY(-50%)",
            backgroundColor: "white",
            border: "1px solid #ccc",
            zIndex: 10,
          }}
          onClick={() => handleAddRow(hoverRow)}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      )}

      {/* Add Column Button */}
      {hoverCol !== null && (
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            top: "-30px",
            left: `${(hoverCol + 1) * 100}px`,
            transform: "translateX(-50%)",
            backgroundColor: "white",
            border: "1px solid #ccc",
            zIndex: 10,
          }}
          onClick={() => handleAddCol(hoverCol)}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  );
};

export default NotionLikeTable;
