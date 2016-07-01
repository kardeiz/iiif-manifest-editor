var React = require('react');
var {connect} = require('react-redux');
var EditableTextArea = require('EditableTextArea');
var actions = require('actions');

var ManifestMetadataPanel = React.createClass({
  getDescriptionForLanguageCode: function(descriptions, languageCode) {
    for(var index = 0; index < descriptions.length; index++) {
      var description = descriptions[index];
      if(description['@language'] === languageCode) {
        return description['@value'];
      }
    }
    return undefined;
  },
  extractManifestMetadata: function() {
    var {manifestData} = this.props;
    if(manifestData.data !== undefined) {
      return {
        attribution: manifestData.data.attribution,
        label: manifestData.data.label,
        description: this.getDescriptionForLanguageCode(manifestData.data.description, 'en'),
        license: manifestData.data.license
      };
    }
  },
  saveMetadataFieldToStore: function(fieldName, fieldValue) {
    var {dispatch} = this.props;
    dispatch(actions.saveMetadataField(fieldName, fieldValue));
  },
  render: function() {
    var metadata = this.extractManifestMetadata();
    return (
      <div className="metadata-sidebar-panel">
        <div className="row">
          <div className="col-md-3 metadata-field-label">Label:</div>
          <EditableTextArea classNames="col-md-9 metadata-field-value" fieldName="label" value={metadata.label} onUpdateHandler={this.saveMetadataFieldToStore}/>
        </div>
        <div className="row">
          <div className="col-md-3 metadata-field-label">Attribution:</div>
          <EditableTextArea classNames="col-md-9 metadata-field-value" fieldName="attribution" value={metadata.attribution} onUpdateHandler={this.saveMetadataFieldToStore}/>
        </div>
        <div className="row">
          <div className="col-md-3 metadata-field-label">Description:</div>
          <EditableTextArea classNames="col-md-9 metadata-field-value" fieldName="description" value={metadata.description} onUpdateHandler={this.saveMetadataFieldToStore}/>
        </div>
        <div className="row">
          <div className="col-md-3 metadata-field-label">License:</div>
          <EditableTextArea classNames="col-md-9 metadata-field-value" fieldName="license" value={metadata.license} onUpdateHandler={this.saveMetadataFieldToStore}/>
        </div>
      </div>
    );
  }
});

module.exports = connect(
  (state) => {
    return {
      manifestData: state.manifestReducer.manifestData
    };
  }
)(ManifestMetadataPanel);