import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({ title, newCases, totalCases }) {
  return (
    <Card className="infoBox">
      <CardContent>
        {/* Title */}
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>

        {/* New Cases */}
        <h2 className="infoBox__newCases" color="textSecondary">
          {newCases}
        </h2>

        {/* Total Cases */}
        <Typography className="infoBox__totalCases" color="textSecondary">
          {totalCases} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
