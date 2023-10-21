import React, { useEffect, useState } from 'react';

import "./CreateDocket.css";
import { Input } from 'semantic-ui-react';
import { axiosURL } from "./http-common";

export default function CreateDocket({ dockets, setDockets, onSubmit, closeModal }) {
  const [docket, setDocket] = useState({
    name: "",
    startTime: "",
    endTime: "",
    noOfHrs: 0,
    ratePerHr: ""
  });
  const [poData, setPOData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState('');

  useEffect(() => {
    async function loadData() {
      const { data } = await axiosURL.get("poData");
      //Filling up supplier information
      let previousSupplier = "";
      data.map(item => {
        if (item.Supplier === "") {
          item.Supplier = previousSupplier;
        } else {
          previousSupplier = item.Supplier;
        }
        return true;
      });
      setPOData([...data]);
      const uniqueSuppliers = [...new Set(data.map(item => item.Supplier))];
      setSuppliers(uniqueSuppliers);
    }
    loadData();
  }, [])

  const getPurchaseOrdersForSupplier = (supplier, data) => {
    return data.filter(item => item.Supplier === supplier);
  };

  const handleSupplierChange = (event) => {
    const selectedSupplier = event.target.value;
    // Filter purchase orders based on the selected supplier.
    setPurchaseOrders(getPurchaseOrdersForSupplier(selectedSupplier, poData));
    setSelectedSupplier(selectedSupplier);
  };

  const handleSubmit = async () => {
    // Creating a docket object with form inputs and selectedSupplier, selectedPurchaseOrder.
    if (docket.name === "" || docket.startTime === "" || docket.endTime === "" || docket.noOfHrs === 0 || docket.ratePerHr === "" || selectedSupplier === "" || selectedPurchaseOrder === "") {
      return alert("Input all the required fields!");
    }
    const newDocket = {
      ...docket,
      supplierName: selectedSupplier,
      purchaseOrder: selectedPurchaseOrder,
    };

    await axiosURL.post("docket", newDocket).then(() => {
      setDockets([...dockets, newDocket]);
      onSubmit();
      setTimeout(() => {
        closeModal();
      }, 1000);
    }).catch((err) => {
      alert("Error occured!")
    });
  };

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container")
          closeModal("Modal was closed");
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <p onClick={() => closeModal("Modal was closed")} className="close">
            &times;
          </p>
        </div>
        <form className='form-div'>
          <label>Name:&nbsp;&nbsp;
            <Input type="text" required onChange={e => setDocket({ ...docket, name: e.target.value })} />
          </label>
          <label>Start Time:&nbsp;&nbsp;
            <Input type="time" required onChange={e => setDocket({ ...docket, startTime: e.target.value })} />
          </label>
          <label>End Time:&nbsp;&nbsp;
            <Input type="time" required onChange={e => setDocket({ ...docket, endTime: e.target.value })} />
          </label>
          <label>No. of hours worked:&nbsp;&nbsp;
            <Input type="number" required onChange={e => setDocket({ ...docket, noOfHrs: parseInt(e.target.value) })} />
          </label>
          <label>Rate per hour:&nbsp;&nbsp;
            <Input type="text" required onChange={e => setDocket({ ...docket, ratePerHr: e.target.value })} />
          </label>
          <label>Supplier Name:&nbsp;&nbsp;
            <select value={selectedSupplier} onChange={handleSupplierChange}>
              <option value="">Select Supplier</option>
              {suppliers.map((supplier, index) => (
                <option key={index} value={supplier}>{supplier}</option>
              ))}
            </select>
          </label>
          <label>Purchase Order:&nbsp;&nbsp;
            <select value={selectedPurchaseOrder} onChange={e => setSelectedPurchaseOrder(e.target.value)}>
              <option value="">Select Purchase Order</option>
              {purchaseOrders.map((order, index) => (
                <option key={index} value={`${order["PO Number"]} - ${order.Description}`} >
                  {order["PO Number"]} - {order.Description}
                </option>
              ))}
            </select>
          </label>
          <button className='submit-btn' type="button" onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </div>
  )
}