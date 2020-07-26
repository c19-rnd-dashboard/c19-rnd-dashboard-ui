import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Tabs from '../../components/Tabs'
import Map from '../../components/Map'
import Tile from '../../components/Tile/Tile'
import styled from 'styled-components'
import { MilestonesGraphContainer } from 'components/MilestonesGraph/MilestonesGraphContainer'
import { Charts } from 'sections/Charts'
import { howYouCanHelpUrl } from 'constants/config'
import { Button, Dialog, DialogTitle } from '@material-ui/core'
import howToVolunteerExampleGif from '../../assets/ExampleHowToVolunteer.gif'

const MapDiv = styled.div`
  width: 100%;
  height: 65vh;
`
const StyledInstructions = styled.div`
  background-color: #25272a !important;
  color: var(--font-color) !important;
  padding: 0.3em 1em;
  margin-bottom: 0.5em;
`

const StyledImg = styled.img`
  height: 100%;
  width: 100%;
`

const HowYouCanHelp = () => {
  const [exampleOpen, setExampleOpen] = useState(false)
  return (
    <StyledInstructions>
      <div style={{ textAlign: 'left' }}>
        <p>
          Are you interested in potentially volunteering for a COVID-19 trial?
        </p>
        <ol>
          <li>
            In the map below, click on a pin near you to find a hospital or
            clinic running a clinical trial on COVID-19.{' '}
          </li>
          <li>
            If you are healthy, look under{' '}
            <span style={{ fontWeight: 'bold' }}>
              “Accepts Healthy Volunteers?”
            </span>{' '}
            and check that it says{' '}
            <span style={{ fontWeight: 'bold' }}>Yes</span>{' '}
          </li>
          <li>
            Click the{' '}
            <span style={{ fontWeight: 'bold' }}>“How to Volunteer”</span>{' '}
            button to find out how to potentially participate in the study.{' '}
          </li>
        </ol>
        <p>
          For more detailed instructions go to our{' '}
          <a href={howYouCanHelpUrl} rel='noopener noreferrer' target='_blank'>
            How You Can Help page
          </a>
          <br />
          If you are in the US make sure to complete this{' '}
          <a
            href='https://www.coronaviruspreventionnetwork.org/clinical-study-volunteer/'
            rel='noopener noreferrer'
            target='_blank'
          >
            NIH form
          </a>
          <br />
          If you are in the UK, complete this{' '}
          <a
            href='https://www.nhs.uk/conditions/coronavirus-covid-19/research/coronavirus-vaccine-research/'
            rel='noopener noreferrer'
            target='_blank'
          >
            NHS form
          </a>
        </p>
        <Button
          onClick={() => setExampleOpen(true)}
          variant='contained'
          color='primary'
        >
          See an Example
        </Button>
        <Dialog
          maxWidth='lg'
          onClose={() => setExampleOpen(false)}
          open={exampleOpen}
        >
          <DialogTitle>How to Volunteer</DialogTitle>
          <StyledImg
            src={howToVolunteerExampleGif}
            alt='How to volunteer example gif'
          />
        </Dialog>
      </div>
    </StyledInstructions>
  )
}

const MapAndMilestones = ({ pins, handleSelectedId, selectedAsset }) => {
  const tabs = [
    {
      title: 'Volunteer Locations',
      content: (
        <Tile>
          <HowYouCanHelp />

          <MapDiv>
            <Map pins={pins} handleSelectedId={handleSelectedId} />
          </MapDiv>
        </Tile>
      ),
    },
    {
      title: 'Timeline',
      content: (
        <MilestonesGraphContainer
          selectedAsset={selectedAsset}
          pins={pins}
          handleSelectedId={handleSelectedId}
        />
      ),
    },
    {
      title: 'Charts',
      content: <Charts pins={pins} />,
    },
  ]

  return <Tabs tabs={tabs} />
}

MapAndMilestones.propTypes = {
  pins: PropTypes.arrayOf(PropTypes.shape({})),
  title: PropTypes.string,
  handleSelectedId: PropTypes.func,
  selectedAsset: PropTypes.shape({}),
}

MapAndMilestones.defaultProps = {
  pins: [],
  selectedAsset: null,
}

export default MapAndMilestones
