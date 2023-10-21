import React, { useEffect, useState } from 'react';
import { Button, Icon, Table } from "semantic-ui-react";
import { createPortal } from "react-dom";
import CreateDocket from './CreateDocket';
import { axiosURL } from "./http-common";

export default function DocketList() {
  const [dockets, setDockets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleButtonClick = () => {
    setModalOpen(!modalOpen);
  };

  const handleSubmitClick = () => {
    loadData();
  };

  const loadData = async () => {
    const response = await axiosURL.get("/docket");
    setDockets(response.data);
  }

  const deleteDocket = async (id) => {
    await axiosURL.delete(`docket/${id}`);
    loadData();
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <h1 className="header-content" >
        User Management System
      </h1>
      <div className='btn-div'>
        <Button color='google plus' onClick={handleButtonClick}>
          <Icon name='plus' />Create Docket
        </Button>
      </div>
      {modalOpen &&
        createPortal(
          <CreateDocket
            dockets={dockets}
            setDockets={setDockets}
            onSubmit={handleSubmitClick}
            closeModal={handleButtonClick}
          />,
          document.body
        )}
      <div className='table'>
        <Table color="blue" striped padded selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign='center' width={1}>Name</Table.HeaderCell>
              <Table.HeaderCell textAlign='center' width={1}>Start Time</Table.HeaderCell>
              <Table.HeaderCell textAlign='center' width={1}>End Time</Table.HeaderCell>
              <Table.HeaderCell textAlign='center' width={1}>No. of hours worked</Table.HeaderCell>
              <Table.HeaderCell textAlign='center' width={1}>Rate per hour</Table.HeaderCell>
              <Table.HeaderCell textAlign='center' width={1}>Supplier Name</Table.HeaderCell>
              <Table.HeaderCell textAlign='center' width={2}>Purchase Order</Table.HeaderCell>
              <Table.HeaderCell textAlign='center' width={1}></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              dockets.map((docket, index) => {
                return (
                  <React.Fragment key={index}>
                    <Table.Row key={index}>
                      <Table.Cell textAlign='center'>{docket.name}</Table.Cell>
                      <Table.Cell textAlign='center'>{docket.startTime}</Table.Cell>
                      <Table.Cell textAlign='center'>{docket.endTime}</Table.Cell>
                      <Table.Cell textAlign='center'>{docket.noOfHrs}</Table.Cell>
                      <Table.Cell textAlign='center'>{docket.ratePerHr}</Table.Cell>
                      <Table.Cell textAlign='center' singleLine>{docket.supplierName}</Table.Cell>
                      <Table.Cell>{docket.purchaseOrder}</Table.Cell>
                      <Table.Cell textAlign='center' collapsing>
                        <Button size="medium" color="red" className="button-delete" onClick={() => deleteDocket(docket.id)}>Delete</Button>
                      </Table.Cell>
                    </Table.Row>
                  </React.Fragment>
                )
              })
            }
            {dockets.length === 0 && (
              <Table.Row>
                <Table.Cell singleLine textAlign='center' colSpan={7}>No data found</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}