/**
=========================================================
* Otis Admin PRO - v2.0.2
=========================================================

* Product Page: https://material-ui.com/store/items/otis-admin-pro-material-dashboard-react/
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// @mui material components
import Container from "@mui/material/Container";

// Otis Admin PRO React example components
import PageLayout from "examples/LayoutContainers/PageLayout";

// Pricing page components
import DefaultHeader from "qims/components/headers/DefaultHeader";
import Footer from "qims/pages/qims-home/components/Footer";
import PricingCards from "qims/pages/qims-home/components/PricingCards";
import TrustedBrands from "qims/pages/qims-home/components/TrustedBrands";
import Faq from "qims/pages/qims-home/components/Faq";

function QimsHomePage() {
  const [tabValue, setTabValue] = useState(0);
  const [prices, setPrices] = useState(["59", "89", "99"]);

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);

    if (event.currentTarget.id === "annual") {
      setPrices(["0", "0", "399"]);
    } else {
      setPrices(["59", "89", "99"]);
    }
  };

  return (
    <PageLayout>
      <DefaultHeader tabValue={tabValue} tabHandler={handleSetTabValue}>
        <Container>
          <PricingCards prices={prices} />
          <TrustedBrands />
          <Faq />
        </Container>
      </DefaultHeader>
      <Footer />
    </PageLayout>
  );
}

export default QimsHomePage;
