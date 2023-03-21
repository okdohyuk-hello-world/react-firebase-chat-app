import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Image from 'react-bootstrap/Image';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { FaLock } from 'react-icons/fa';
import { MdFavorite } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';

function MessageHeader({ handleSearchChange }) {
  return (
    <div
      style={{
        width: '100%',
        height: 'auto',
        border: '.2rem solid #ececec',
        borderRadius: '4px',
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      <Container>
        <Row>
          <Col>
            <h2>
              <FaLock /> ChatRoomName <MdFavorite />
            </h2>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <AiOutlineSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search Message"
                aria-label="Search"
                aria-describedby="basic-addon1"
                onChange={handleSearchChange}
              />
            </InputGroup>
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <p>
            <Image src="" /> {''}user name
          </p>
        </div>
        <Row>
          <Col>
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Button eventKey="0">123</Accordion.Button>
                </Card.Header>
                <Accordion.Body eventKey="0">
                  <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Body>
              </Card>
            </Accordion>
          </Col>
          <Col>
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Button eventKey="0">123</Accordion.Button>
                </Card.Header>
                <Accordion.Body eventKey="0">
                  <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Body>
              </Card>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MessageHeader;
