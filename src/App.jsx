import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Input, Select, Switch, ConfigProvider, theme, Button, Modal, Form } from "antd";
import "./App.css";

const { Search } = Input;
const { Option } = Select;

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://gist.githubusercontent.com/ak1103dev/e4a31efd9f5dcac80e086f0ab9a88ffb/raw/e77545dbef9b06bd138b085b5421eaca77cfe18f/cars.json"
      );

      if (response.data && Array.isArray(response.data.Makes)) {
        const transformedData = response.data.Makes.map((item) => ({
          key: item.make_display,
          name: item.make_display,
          country: item.make_country,
        }));

        setData(transformedData);
        setFilteredData(transformedData);
      } else {
        console.error("Data is not in the expected format!");
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const handleSearch = (value) => {
    setSearchText(value);
    filterData(value, selectedCountry);
  };

  const handleFilterCountry = (value) => {
    setSelectedCountry(value);
    filterData(searchText, value);
  };

  const filterData = (name, country) => {
    let filtered = data;
    if (name) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (country) {
      filtered = filtered.filter((item) => item.country === country);
    }
    setFilteredData(filtered);
  };

  const handleAdd = () => {
    form.resetFields();
    setEditRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (key) => {
    const updatedData = data.filter((item) => item.key !== key);
    setData(updatedData);
    setFilteredData(updatedData);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editRecord) {
        const updatedData = data.map((item) =>
          item.key === editRecord.key ? { ...values, key: editRecord.key } : item
        );
        setData(updatedData);
        setFilteredData(updatedData);
      } else {
        const newData = { ...values, key: values.name };
        setData([...data, newData]);
        setFilteredData([...filteredData, newData]);
      }
      setIsModalOpen(false);
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Actions",
      key: "actions",
      
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.key)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <div style={{ padding: 20, minHeight: "100vh", marginTop: 100 }}>
        <h2>Cars 🚗</h2>

        <div style={{ marginBottom: 15 }}>
          <Switch 
            checked={darkMode} 
            onChange={() => setDarkMode(!darkMode)} 
            checkedChildren="Dark" 
            unCheckedChildren="Light" 
          />
        </div>

        <Select 
          placeholder="Select Country" 
          style={{ width: 200, marginRight: 10 }} 
          onChange={handleFilterCountry} 
          allowClear
        >
          {[...new Set(data.map((item) => item.country))].map((country) => (
            <Option key={country} value={country}>{country}</Option>
          ))}
        </Select>

        <Search 
          placeholder="Search Name" 
          style={{ width: 200, marginRight: 10 }} 
          allowClear 
          onSearch={handleSearch} 
        />
        <Button type="primary" onClick={handleAdd}>Add Car</Button>

        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="key" 
          pagination={{ pageSize: 5, showSizeChanger: false }} 
          style={{marginTop:20}}
        />
      </div>

      <Modal title={editRecord ? "Edit Car" : "Add Car"} open={isModalOpen} onOk={handleSave} onCancel={() => setIsModalOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Car Name" rules={[{ required: true, message: "Please enter the car name!" }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Country" rules={[{ required: true, message: "Please enter the country!" }]}> 
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <div className="watermark" style={{marginBottom: "25px"}}>© 2025 Witsawa Corporation Testing</div>
    </ConfigProvider>
  );
}

export default App;
