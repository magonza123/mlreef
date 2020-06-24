import React, { useState, useEffect } from 'react';
import { toastr } from 'react-redux-toastr';
import moment from 'moment';
import PipeLinesApi from 'apis/PipelinesApi';
import { shape, string, arrayOf } from 'prop-types';

const DetailsSummary = ({
  projectId, experimentName, currentState, parameters, pipelineInfo,
}) => {
  const [pipelineDetails, setDetails] = useState({});
  let startedAt = '---';
  let finishedAt = '---';
  if (pipelineDetails.started_at) {
    startedAt = pipelineDetails.started_at.split('.')[0];
  }
  if (pipelineDetails.finished_at) {
    finishedAt = pipelineDetails.finished_at.split('.')[0];
  }

  let experimentStatus = (
    <b className={`m-auto ${currentState.toLowerCase() === 'success' ? 't-primary' : 't-danger'}`}>
      {currentState}
    </b>
  );

  if (currentState === 'running') {
    experimentStatus = (
      <b style={{ color: '#2DB391' }}>
        {currentState}
      </b>
    );
  } else if (currentState === 'pending') {
    experimentStatus = (
      <b style={{ color: '#E99444' }}>
        {currentState}
      </b>
    );
  }

  useEffect(() => {
    PipeLinesApi.getPipesById(projectId, pipelineInfo.id)
      .then((res) => setDetails(res))
      .catch(() => toastr.error('Error', 'Could not fetch the pipeline information'));
  }, [projectId, pipelineInfo.id]);
  return (
    <div style={{ width: '100%' }}>
      <div style={{
        borderLeft: '1px solid rgb(236, 236, 236)',
        height: '5em',
        display: 'flex',
      }}
      >
        <p className="experiment-details-subtitle">Metadata</p>
      </div>
      <div style={{ display: 'flex', width: '100%' }}>
        <div
          id="experiment-data-content"
          style={{
            width: '100%',
            padding: '0px 1em',
            borderBottom: '1px solid rgb(236, 236, 236)',
            borderTop: '1px solid rgb(236, 236, 236)',
          }}
        >
          <div className="content-subdiv">
            <div className="composed-row">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ width: '10em', margin: '5px' }}>Experiment name: </p>
                <p><b>{experimentName}</b></p>
              </div>
              <p>
                ID:
                <button
                  type="button"
                  style={{
                    border: '1px solid gray',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                  }}
                >
                  {pipelineDetails.id}
                </button>
              </p>
            </div>
            <div style={{ display: 'flex' }}>
              <p style={{ width: '10em' }}>Status: </p>
              <p className="d-flex m-0">
                {experimentStatus}
              </p>
            </div>
          </div>
          <br />
          <div className="content-subdiv">
            <div
              style={{ display: 'flex' }}
            >
              <p style={{ width: '10em' }}>Created:</p>
              <p style={{ marginLeft: 0 }}><b>{startedAt}</b></p>
            </div>
            <div className="composed-row">
              <div style={{ display: 'flex' }}>
                <p style={{ width: '10em', marginLeft: '5px' }}>Completed:</p>
                <p style={{ marginLeft: '5px' }}><b>{finishedAt}</b></p>
              </div>
              <p>
                Training time:
                <b>
                  {pipelineDetails.duration
                    ? moment({}).startOf('day').seconds(pipelineDetails.duration).format('HH:mm:ss')
                    : '---'}
                </b>
              </p>
            </div>
            <div style={{ display: 'flex' }}>
              <p style={{ width: '10em' }}>Owner: </p>
              <p style={{ marginLeft: 0 }}><b>mlreef</b></p>
            </div>
          </div>
          <br />
          {/* <p className="experiment-details-subtitle" style={{ paddingLeft: '5px' }}>Source summary</p>
          <div className="composed-row">
            <div style={{ display: 'flex' }}>
              <p style={{ marginRight: 5, width: '10em' }}>Data source:</p>
              <p><b>Data_Repository / Data Instance</b></p>
            </div>
          </div> */}
          <p className="experiment-details-subtitle" style={{ paddingLeft: '5px' }}>All parameters</p>
        </div>
      </div>
      <div style={{ margin: '1em' }}>
        <table
          style={{
            width: '100%',
            textAlign: 'left',
            borderRadius: '10px',
            border: '1px solid #e5e5e5',
            padding: '1px',
            borderCollapse: 'collapse',
          }}
        >
          <thead style={{ backgroundColor: '#1d2b40', color: '#fff' }}>
            <tr>
              <th style={{ paddingLeft: '10px' }}>
                <p>#</p>
              </th>
              <th>
                <p>Parameter</p>
              </th>
              <th>
                <p>Values</p>
              </th>
              <th>
                <p>Type</p>
              </th>
            </tr>
          </thead>
          <tbody className="files-tbody">
            {parameters.map((param, index) => (
              <tr style={{ borderBottom: '1px solid #1d2b40' }} key={`${param.name}-${index.toString()}`}>
                <td style={{ paddingLeft: '10px' }}>
                  {(index + 1)}
                </td>
                <td>
                  {param.name}
                </td>
                <td>
                  <p>{param.value ? param.value : param.default_value}</p>
                </td>
                <td>
                  <p>{param.type}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

DetailsSummary.defaultProps = {
  experimentName: '',
};

DetailsSummary.propTypes = {
  projectId: string.isRequired,
  experimentName: string,
  currentState: string.isRequired,
  parameters: arrayOf(
    shape({
      name: string.isRequired,
      type: string.isRequired,
      value: string.isRequired,
    }).isRequired,
  ).isRequired,
  pipelineInfo: shape(arrayOf).isRequired,
};

export default DetailsSummary;
