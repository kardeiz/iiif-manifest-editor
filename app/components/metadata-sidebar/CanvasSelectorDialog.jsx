var React = require('react');
var ReactDOM = require('react-dom');
var { connect } = require('react-redux');
var MetadataSidebarCanvas = require('MetadataSidebarCanvas');
var Utils = require('Utils');

var CanvasSelectorDialog = React.createClass({
  getInitialState: function() {
    var selectedCanvasId = undefined;
    if(this.props.canvas !== undefined) {
      selectedCanvasId = this.props.canvas;
    } else if(this.props.manifestData.sequences[0].canvases.length > 0) {
      selectedCanvasId = this.props.manifestData.sequences[0].canvases[0]['@id'];
    }
    return { 
      showHelp: false,
      selectedCanvasId: selectedCanvasId
    };
  },
  showHelp: function() {
    this.setState({ showHelp: !this.state.showHelp });
  },
  updateSelectedCanvas: function(e) {
    this.setState({ 
      selectedCanvasId: e.target.value
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    if(this.state.selectedCanvasId != undefined) {
      this.props.onSubmitHandler(this.state.selectedCanvasId);
    } else if(this.props.manifestData.sequences[0].canvases.length > 0) {
      // if no canvas was selected from dropdown menu, use the first one if there is at least one canvas in the sequence
      this.props.onSubmitHandler(this.props.manifestData.sequences[0].canvases[0]['@id']);
    }

    // close modal window
    var $imageAnnotationChoiceDialog = $(ReactDOM.findDOMNode(this));
    $imageAnnotationChoiceDialog.modal('hide');
  },
  render: function() {
    var canvases = this.props.manifestData.sequences[0].canvases;
    return (
      <div className="modal fade canvas-selector-dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h4 className="modal-title">Select Thumbnail Image</h4>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="text-right">
                    <i className="fa fa-info-circle"></i>&nbsp;
                    <a href="javascript:;" onClick={this.showHelp}>{this.state.showHelp ? 'Hide' : 'Help'}</a>
                  </div>
                  <div id="imageAnnotationUpdateHelp" className={!this.state.showHelp ? 'hidden' : null}>
                    <p>Show help text here:</p>
                  </div>
                </div>
              </div>

              <hr />

              <form className="canvas-selector-dropdown-menu form-inline">
                <div className="form-group">
                  <label>Select a manifest thumbnail from the sequence:</label>
                  <select ref="canvasSelectionDropdownMenu" className="form-control" onChange={this.updateSelectedCanvas} defaultValue={this.state.selectedCanvasId}>
                    {
                      canvases.map(function(canvas, canvasIndex) {
                        return (
                          <option key={canvasIndex} value={canvas['@id']}>{Utils.getLocalizedPropertyValue(canvas.label)}</option>
                        );
                      })
                    }
                  </select>
                </div>
              </form>

              <MetadataSidebarCanvas canvasId={this.state.selectedCanvasId} />
            </div>
            <div className="modal-footer">
              <button type="submit" onClick={this.handleSubmit} className="btn btn-primary"><i className="fa fa-save"></i> Save</button>
              <button type="button" className="btn btn-default" data-dismiss="modal"><i className="fa fa-close"></i> Close</button>
            </div>
          </div>
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
)(CanvasSelectorDialog);