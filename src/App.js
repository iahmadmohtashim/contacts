// App.js
import React, { useState, useEffect } from 'react';
import logo from '../src/assets/logo.png';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(5);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const storedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    setContacts(storedContacts);
  }, []);

  const saveToLocalStorage = (updatedContacts) => {
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    setContacts(updatedContacts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId !== null) {
      const updatedContacts = contacts.map(contact =>
        contact.id === editId ? { ...contact, name, email, phone } : contact
      );
      saveToLocalStorage(updatedContacts);
      setEditId(null);
    } else {
      const newContact = {
        id: Date.now(),
        name,
        email,
        phone
      };
      saveToLocalStorage([...contacts, newContact]);
    }

    setName('');
    setEmail('');
    setPhone('');
  };

  const handleEdit = (contact) => {
    setName(contact.name);
    setEmail(contact.email);
    setPhone(contact.phone);
    setEditId(contact.id);
  };

  const handleDelete = (id) => {
    const filteredContacts = contacts.filter(contact => contact.id !== id);
    saveToLocalStorage(filteredContacts);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredContacts = sortedContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="App">
      <header className="app-header">
        <img src={logo} className="app-logo" alt="Contact Manager Logo" />
        <h1>Contact</h1>
      </header>

      <input
        type="text"
        placeholder="Search contacts..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">
          {editId !== null ? 'Update Contact' : 'Add Contact'}
        </button>
      </form>

      <div className="sort-buttons">
        <button onClick={() => handleSortChange('name')}>Sort by Name</button>
        <button onClick={() => handleSortChange('email')}>Sort by Email</button>
        <button onClick={() => handleSortChange('phone')}>Sort by Phone</button>
      </div>

      <div className="contacts-list">
        {currentContacts.map(contact => (
          <div key={contact.id} className="contact-card">
            <h3>{contact.name}</h3>
            <p>{contact.email}</p>
            <p>{contact.phone}</p>
            <button onClick={() => handleEdit(contact)}>Edit</button>
            <button onClick={() => handleDelete(contact.id)}>Delete</button>
          </div>
        ))}
      </div>

      <Pagination
        contactsPerPage={contactsPerPage}
        totalContacts={filteredContacts.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
}

const Pagination = ({ contactsPerPage, totalContacts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalContacts / contactsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <a onClick={() => paginate(number)} href="#!" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default App;