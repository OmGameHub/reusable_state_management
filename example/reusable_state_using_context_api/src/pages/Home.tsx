import { Card, Col, Row } from "antd";
import { Link } from "react-router";

import { pages } from "@/config/constant";

const Home = () => {
  return (
    <Row gutter={[16, 16]}>
      {pages.map((page, index) => (
        <Col key={index} span={6}>
          <Link to={page.path}>
            <Card className="page_card" hoverable>
              <h2 className="text-xl font-medium">{page.name}</h2>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
};

export default Home;
