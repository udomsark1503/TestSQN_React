import React from "react";
import { Col, Row } from "antd";

const App = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24}>
        <h1>Population growth per country, 1950 to 2021</h1>
        <h2>Click on the legend below to filter by continent 👇</h2>
      </Col>
      <Col xs={24}>
        <iframe
          src="https://flo.uri.sh/visualisation/15739165/embed"
          title="Interactive or visual content"
          className="flourish-embed-iframe"
          frameBorder="0"
          scrolling="no"
          style={{ width: "100%", height: "600px" }}
          sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        ></iframe>
        <div
          style={{
            width: "100%",
            marginTop: "4px",
            textAlign: "right",
          }}
        >
          <a
            className="flourish-credit"
            href="https://public.flourish.studio/visualisation/15739165/?utm_source=embed&utm_campaign=visualisation/15739165"
            target="_top"
            style={{ textDecoration: "none" }}
          >
            
          </a>
        </div>
      </Col>
    </Row>
  );
};

export default App;
