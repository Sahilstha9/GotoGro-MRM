import React, {useEffect, useState} from "react";
import {Link, NavLink} from "react-router-dom";
import {useParams} from "react-router";

const Record = (props) => (
    <tr>
        <td>{props.record._id}</td>
        <td>{new Date(props.record.timestamp).toString()}</td>
        <td>{new Date(props.record.timestamp + 30 * 24 * 60 * 60 * 1000).toString()}</td>
        <td>
            <Link className="btn btn-link" to={`./edit/${props.record._id}`}>Edit</Link> |
            <button className="btn btn-link"
                    onClick={() => {
                        props.deleteRecord(props.record._id);
                    }}
            >
                Delete
            </button>
        </td>
    </tr>
);


export default function RecordView() {
    const [records, setRecords] = useState([]);
    const params = useParams();

    const origin = window.location.origin;
    //const port = window.location.port;

    // This method fetches the records from the database.
    useEffect(() => {
        async function getRecords() {
            const response = await fetch(`${origin.replace("3000", "5000")}/api/v1/sales?member=${params.id.toString()}&product=[MEMBERSHIP_PRODUCT_ID]`); // Replace MEMBERSHIP_PRODUCT_ID with the id of the membership product from your product collection

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const records = await response.json();
            records.timestamp = parseInt(records._id.substr(0, 8), 16) * 1000
            setRecords(records);
        }

        getRecords();
    }, [records.length]);

    // This method will delete a record
    async function deleteRecord(id) {
        await fetch(`${origin.replace("3000", "5000")}/api/v1/members/${id}`, {
            method: "DELETE"
        });

        const newRecords = records.filter((el) => el._id !== id);
        setRecords(newRecords);
    }

    // This method will map out the records on the table
    function recordView() {
        
            return (
                <Record
                    record={records}
                    deleteRecord={() => deleteRecord(records._id)}
                    key={records._id}
                />
            );
      
    }

    return (
        <div>
            <h3>Member Record List</h3>
            <NavLink className="nav-link" to="./create">
                Create Member
            </NavLink>
            <table className="table table-striped" style={{marginTop: 20}}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Start Date</th>
                    <th>Expiry Dated</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>{recordView()}</tbody>
            </table>
        </div>
    );
}
