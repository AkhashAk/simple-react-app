import React, { useEffect, useState } from 'react';
import { Button, Icon, Table } from "semantic-ui-react";
import { createPortal } from "react-dom";
import CreateDocket from './CreateDocket';
import { axiosURL } from "./http-common";
import UpdateDocket from './UpdateDocket';

export default function DocketList() {
  const [dockets, setDockets] = useState([]);
  const [currentDocket, setCurrentDocket] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const handleCreateModalBtnClick = () => {
    setModalOpen(!modalOpen);
  };

  const handleCreateUpdateModalBtnClick = () => {
    setUpdateModalOpen(!updateModalOpen);
  };

  const handleSubmitClick = () => {
    loadData();
  };

  const loadData = async () => {
    const response = await axiosURL.get("docket");
    setDockets(response.data);
  }

  const updateDocket = async (docket) => {
    setCurrentDocket(docket);
    setUpdateModalOpen(true);
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
        List of Purchase Orders
      </h1>
      <div className='btn-div'>
        <Button color='google plus' onClick={handleCreateModalBtnClick}>
          <Icon name='plus' />Create Docket
        </Button>
      </div>
      {modalOpen &&
        createPortal(
          <CreateDocket
            dockets={dockets}
            setDockets={setDockets}
            onSubmit={handleSubmitClick}
            closeModal={handleCreateModalBtnClick}
          />,
          document.body
        )}
      {updateModalOpen &&
        createPortal(
          <UpdateDocket
            currentDocket={currentDocket}
            setCurrentDocket={setCurrentDocket}
            onSubmit={handleSubmitClick}
            closeModal={handleCreateUpdateModalBtnClick}
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
                        <Button size="medium" color="facebook" className="button-delete" onClick={() => updateDocket(docket)}>Edit</Button>
                      </Table.Cell>
                      <Table.Cell textAlign='center' collapsing>
                        <Button size="medium" color="google plus" className="button-delete" onClick={() => deleteDocket(docket.id)}>Delete</Button>
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