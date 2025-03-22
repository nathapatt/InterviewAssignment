import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Input, Select, Switch, ConfigProvider, theme } from "antd";
import "./App.css";

const { Search } = Input;
const { Option } = Select;

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://gist.githubusercontent.com/ak1103dev/e4a31efd9f5dcac80e086f0ab9a88ffb/raw/e77545dbef9b06bd138b085b5421eaca77cfe18f/cars.json"
      );

      if (response.data && Array.isArray(response.data.Makes)) {
        const transformedData = response.data.Makes.map((item) => ({
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
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div style={{ padding: 20, minHeight: "100vh", marginTop: 100 }}>
        <h2>Cars 🚗</h2>

        {/* Dark Mode Toggle */}
        <div style={{ marginBottom: 15 }}>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            checkedChildren="Dark"
            unCheckedChildren="Light"
          />
        </div>

        {/* Country Filter */}
        <Select
          placeholder="Select Country"
          style={{ width: 200, marginRight: 10 }}
          onChange={handleFilterCountry}
          allowClear
        >
          {[...new Set(data.map((item) => item.country))].map((country) => (
            <Option key={country} value={country}>
              {country}
            </Option>
          ))}
        </Select>

        {/* Search Bar */}
        <Search
          placeholder="Search Name"
          style={{ width: 200}}
          allowClear
          onSearch={handleSearch}
        />

        {/* Data Table */}
        <Table
          columns={columns}
          dataSource={filteredData || []}
          rowKey="name"
          pagination={{ pageSize: 5, showSizeChanger: false }}
          className="table-container"
          style={{ boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)", borderRadius: "8px" }}
        />
      </div>
      <div className="watermark">© 2025 Witsawa Corporation Testing</div>
    </ConfigProvider>
  );
}

export default App;
