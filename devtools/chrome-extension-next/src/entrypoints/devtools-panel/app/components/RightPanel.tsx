import ReactJson from '@microlink/react-json-view'

export const RightPanel = ({ dataSource }: { dataSource: any }) => {
  return (
    <div className="rightPanel">
      <ReactJson
        src={dataSource}
        name={dataSource && dataSource.displayName}
        theme="hopscotch"
        displayDataTypes={false}
        enableClipboard={false}
        sortKeys={true}
        onEdit={false}
        onAdd={false}
        onDelete={false}
        iconStyle="square"
      />
    </div>
  )
}
