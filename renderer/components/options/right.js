import React from 'react';
import PropTypes from 'prop-types';

import {DropdownArrowIcon} from '../../vectors';
import {connect, EditorContainer} from '../../containers';

class RightOptions extends React.Component {
  render() {
    const {options, format, plugin, selectFormat, selectPlugin, formats, startExport} = this.props;

    const formatOptions = options ? formats.map(format => ({value: format, label: options[format].prettyFormat})) : [];
    const pluginOptions = options ? options[format].plugins.map(plugin => ({value: plugin.title, label: plugin.title})) : [];

    return (
      <div className="container">
        <div className="format">
          <Select options={formatOptions} selected={format} onChange={selectFormat}/>
        </div>
        <div className="plugin">
          <Select options={pluginOptions} selected={plugin} onChange={selectPlugin}/>
        </div>
        <div className="button" onClick={startExport}>Export</div>
        <style jsx>{`
          .container {
            height: 100%;
            display: flex;
            align-items: center;
          }

          .format {
            height: 24px;
            width: 80px;
            margin-right: 16px;
          }

          .plugin {
            height: 24px;
            width: 128px;
            margin-right: 16px;
          }

          .button {
            padding: 4px 8px;
            background: hsla(0,0%,100%,.1);
            font-size: 12px;
            color: white;
            height: 24px;
            border-radius: 4px;
            text-align: center;
            width: 80px;
            cursor: pointer;
          }

          .button:hover {
            background: hsla(0,0%,100%,.2);
          }
        `}</style>
      </div>
    );
  }
}

class Select extends React.Component {
  handleChange = event => {
    const {onChange} = this.props;
    onChange(event.target.value);
  }

  render() {
    const {options, selected} = this.props;
    const selectedOption = options.find(opt => opt.value === selected);
    const label = selectedOption && selectedOption.label;

    return (
      <div className="container">
        <select value={selected} onChange={this.handleChange}>
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <div className="label">{label}</div>
        <div className="dropdown"><DropdownArrowIcon/></div>
        <style jsx>{`
          .container {
            width: 100%;
            height: 100%;
            position: relative;
            background: yellow;
            border-radius: 4px;
            padding: 4px 8px;
            background: hsla(0,0%,100%,.1);
            font-size: 12px;
            color: white;
            display: flex;
            justify-content: space-between;
          }

          .label {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .container:hover {
            background: hsla(0,0%,100%,.2);
          }

          select {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
          }

          .dropdown {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 18px;
          }
        `}</style>
      </div>
    );
  }
}

export default connect(
  [EditorContainer],
  ({options, format, plugin, formats}) => ({options, format, plugin, formats}),
  ({selectFormat, selectPlugin, startExport}) => ({selectFormat, selectPlugin, startExport})
)(RightOptions);
