import './Setting.css'
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

import { get_setting, set_setting } from '../api/api';
import { Card } from 'primereact/card';

export default function Setting() {
  const [configs, setConfigs] = useState([])

  useEffect(() => {
    get_setting().then(res => {
      let _list = res.data.data
      _list = _list.filter((v) => {
        return (
          v.Key != "AccessToken" && 
          v.Key != "ExpiredAt"
        )
      })
      setConfigs(_list)
    })
  }, [])

  const onRowEditComplete = (e) => {
    let _configs = [...configs];
    let { newData, index } = e;

    _configs[index] = newData;

    setConfigs(_configs);
    set_setting({ key: newData.Key, value: newData.Value }).then(res => {
      console.log(res)
    })
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const valueTemp = (row) => {
    console.log(row)
    return <p style={{ overflow: 'revert' }}>{row.Value}</p>
  }

  return (
    <Card className='setting-card'>
      <DataTable className="setting-table" value={configs} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} resizableColumns stripedRows tableStyle={{ minWidth: '50rem' }} >
        <Column className="setting-table-column" key='key' field="Key" header="Key" ></Column>
        <Column className="setting-table-column" key='value' field="Value" header="Value" body={valueTemp} bodyStyle={{ maxWidth: '30rem' }} editor={(options) => textEditor(options)} ></Column>
        <Column className="setting-table-column" key='description' field="Description" header="Description" ></Column>
        <Column className="setting-table-column" rowEditor={true} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} ></Column>
      </DataTable>
    </Card>
  )
}