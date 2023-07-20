import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

function Entries({ db }) {
  const [entries, setEntries] = useState([]);
  const [buildingCodeFilter, setBuildingCodeFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  const formatTimestamp = (timestamp) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return new Date(timestamp.seconds * 1000).toLocaleString('en-US', options);
  };

  const fetchEntries = async () => {
    try {
      const entriesRef = collection(db, 'entries');
      let filteredQuery = query(entriesRef, orderBy('timestamp', 'desc'));

      // Apply filters
      if (buildingCodeFilter !== '') {
        filteredQuery = query(filteredQuery, where('buildingCode', '==', buildingCodeFilter));
      }

      if (startDateFilter !== '') {
        const startDate = new Date(startDateFilter);
        startDate.setHours(0, 0, 0, 0);
        filteredQuery = query(filteredQuery, where('timestamp', '>=', startDate));
      }

      if (endDateFilter !== '') {
        const endDate = new Date(endDateFilter);
        endDate.setHours(23, 59, 59, 999);
        filteredQuery = query(filteredQuery, where('timestamp', '<=', endDate));
      } else {
        // If no end date specified, set a default date range (last 7 days)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        filteredQuery = query(filteredQuery, where('timestamp', '>=', startDate));
      }

      const querySnapshot = await getDocs(filteredQuery);
      const entriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEntries(entriesData);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [db, buildingCodeFilter, startDateFilter, endDateFilter]);

  // Get all unique building codes from entries
  const allBuildingCodes = [...new Set(entries.map((entry) => entry.buildingCode))];

  return (
    <div>
      <h2>Entries Page</h2>
      <div>
        <label>
          Building Code:
          <select value={buildingCodeFilter} onChange={(e) => setBuildingCodeFilter(e.target.value)}>
            <option value="">All</option>
            {allBuildingCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>
        <label>
          Start Date:
          <input type="date" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} />
        </label>
        <label>
          End Date:
          <input type="date" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} />
        </label>
        <button onClick={fetchEntries}>Apply Filters</button>
      </div>
      <table className="custom-table">
        <thead>
          <tr>
            <th>User Email</th>
            <th>Building Code</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.userEmail}</td>
              <td>{entry.buildingCode}</td>
              <td>{formatTimestamp(entry.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Entries;
