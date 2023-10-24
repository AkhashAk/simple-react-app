import React, { useEffect, useState } from 'react';

import { Input } from 'semantic-ui-react';
import { axiosURL } from "./http-common";

export default function UpdateDocket({ currentDocket, setCurrentDocket, onSubmit, closeModal }) {
  const [poData, setPOData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(currentDocket.supplierName);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(currentDocket.purchaseOrder);

  const getPurchaseOrdersForSupplier = (supplier) => {
    return poData.filter(item => item.Supplier === supplier);
  };

  const handleSupplierChange = (selectedSupplierName) => {
    // Filter purchase orders based on the selected supplier.
    setPurchaseOrders(getPurchaseOrdersForSupplier(selectedSupplierName));
    setSelectedSupplier(selectedSupplierName);
  };

  const handleSubmit = async () => {
    // Creating a docket object with form inputs and selectedSupplier, selectedPurchaseOrder.
    if (currentDocket.name === "" || currentDocket.startTime === "" || currentDocket.endTime === "" || currentDocket.noOfHrs === 0 || currentDocket.ratePerHr === "" || selectedSupplier === "" || selectedPurchaseOrder === "") {
      return alert("Input all the required fields!");
    }
    const updatedDocket = {
      ...currentDocket,
      supplierName: selectedSupplier,
      purchaseOrder: selectedPurchaseOrder,
    };

    await axiosURL.post(`docket/${currentDocket._id}`, updatedDocket).then(() => {
      setTimeout(() => {
        closeModal();
      }, 500);
      setTimeout(() => {
        onSubmit();
      }, 1000);
    }).catch((err) => {
      alert("Error occured!")
    });
  };

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
  }, []);

  useEffect(() => {
    setPurchaseOrders(poData.filter(item => item.Supplier === selectedSupplier));
  }, [poData, selectedSupplier]);

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container")
          closeModal("Modal was closed");
      }}>
      <div className="modal">
        <div className="modal-header">
          <p onClick={() => closeModal("Modal was closed")} className="close">
            &times;
          </p>
        </div>
        <form className='form-div'>
          <label>Name:&nbsp;&nbsp;
            <Input type="text" value={currentDocket.name} required onChange={e => setCurrentDocket({ ...currentDocket, name: e.target.value })} />
          </label>
          <label>Start Time:&nbsp;&nbsp;
            <Input type="time" value={currentDocket.startTime} required onChange={e => setCurrentDocket({ ...currentDocket, startTime: e.target.value })} />
          </label>
          <label>End Time:&nbsp;&nbsp;
            <Input type="time" value={currentDocket.endTime} required onChange={e => setCurrentDocket({ ...currentDocket, endTime: e.target.value })} />
          </label>
          <label>No. of hours worked:&nbsp;&nbsp;
            <Input type="number" value={currentDocket.noOfHrs} required onChange={e => setCurrentDocket({ ...currentDocket, noOfHrs: parseInt(e.target.value) })} />
          </label>
          <label>Rate per hour:&nbsp;&nbsp;
            <Input type="text" value={currentDocket.ratePerHr} required onChange={e => setCurrentDocket({ ...currentDocket, ratePerHr: e.target.value })} />
          </label>
          <label>Supplier Name:&nbsp;&nbsp;
            <select value={selectedSupplier} onChange={e => handleSupplierChange(e.target.value)}>
              <option value="">Selected Supplier</option>
              {suppliers.map((supplier, index) => (
                <option key={index} value={supplier}>{supplier}</option>
              ))}
            </select>
          </label>
          <label>Purchase Order:&nbsp;&nbsp;
            <select value={selectedPurchaseOrder} onChange={e => setSelectedPurchaseOrder(e.target.value)}>
              <option value="">Select Purchase Order</option>
              {purchaseOrders.length > 0 ? purchaseOrders.map((order, index) => (
                <option key={index} value={`${order["PO Number"]} - ${order.Description}`} >
                  {order["PO Number"]} - {order.Description}
                </option>
              )) : null}
            </select>
          </label>
          <button className='submit-btn' type="button" onClick={handleSubmit}>save</button>
        </form>
      </div>
    </div>
  )
}