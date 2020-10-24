import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Popup } from 'react-map-gl'
import styled from 'styled-components'
import ReactGA from 'react-ga'
import {
  useTheme,
  CardContent,
  Card,
  Typography,
  CardActions,
  Button,
  Divider,
  Link,
  Box,
} from '@material-ui/core'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'

const DontBreakOutLink = styled(Link)`
  /* These are technically the same, but use both */
  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  /* This is the dangerous one in WebKit, as it breaks things wherever */
  word-break: break-all;
  /* Instead use this non-standard one: */
  word-break: break-word;

  /* Adds a hyphen where the word breaks, if supported (No Blink) */
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
`

const MobileOptimizedDisplay = styled.div`
  @media only screen and (max-width: 600px) {
    display: ${props =>
    props.alwaysShow || props.onlyMobile ? 'initial' : 'none'};
  }
  @media only screen and (min-width: 601px) {
    display: ${props => (props.onlyMobile ? 'none' : 'initial')};
  }
`

const DisplayField = ({
  label,
  content,
  bold,
  alwaysShow = false,
  onlyMobile = false,
}) => (
  <MobileOptimizedDisplay alwaysShow={alwaysShow} onlyMobile={onlyMobile}>
    <Typography
      color='textSecondary'
      style={{
        fontSize: '0.8rem',
      }}
    >
      {label}
    </Typography>
    <Typography
      style={{
        fontSize: '1rem',
        wordBreak: 'break-word',
      }}
      gutterBottom
    >
      {bold ? <b>{content}</b> : content}
    </Typography>
  </MobileOptimizedDisplay>
)

DisplayField.propTypes = {
  label: PropTypes.string,
  content: PropTypes.node,
  bold: PropTypes.bool,
  alwaysShow: PropTypes.bool,
  onlyMobile: PropTypes.bool,
}

const DividerWithMargin = styled(Divider)`
  margin: 1rem 0;
`

const PopUpDisplay = ({ popupInfo, onClose }) => {
  const [learnMoreOpen, setLearnMoreOpen] = useState(false)
  const theme = useTheme()
  const isPopupAndClicked = popupInfo && popupInfo.clickedLocation.lng
  const handleClick = () => {
    ReactGA.event({
      category: 'volunteer',
      action: 'How to volunteer clicked',
      label: 'Popup button, how to volunteer',
    })
    setLearnMoreOpen(!learnMoreOpen)
  }
  useEffect(() => {
    setLearnMoreOpen(false)
  }, [isPopupAndClicked])
  if (popupInfo) {
    const {
      clickedLocation,
      phase,
      preferredName,
      registryLink,
      acceptsHealthySubjects,
      contact = [{}],
      sponsors,
    } = popupInfo
    const participation = contact[0]
    const sponsorNames = sponsors.map(sponsor => sponsor.sponsorName).join(', ')
    const sponsorPlural = sponsors.length > 1 ? 'Sponsors' : 'Sponsor'
    const firstSponsor = sponsors[0] && sponsors[0].sponsorName
    const StyledPopup = styled(Popup)`
      .mapboxgl-popup-content {
        padding: 0px;
        user-select: text;
        cursor: text;
      }
      .mapboxgl-popup-close-button {
        color: ${theme.palette.text.primary};
        font-size: ${theme.typography.fontSize};
      }
      .MuiPaper-root {
        min-width: 10rem !important;
      }
      @media only screen and (max-width: 601px) {
        .MuiPaper-root {
          max-width: 15rem !important;
        }
      }
      .MuiCardContent-root:last-child {
        padding-bottom: 2px;
      }
    `
    return (
      <StyledPopup
        tipSize={5}
        anchor='top'
        longitude={clickedLocation.lng}
        latitude={clickedLocation.lat}
        closeOnClick={false}
        onClose={onClose}
      >
        <Card style={{ maxWidth: '26rem', minWidth: '20rem' }}>
          {learnMoreOpen ? (
            <>
              <CardContent>
                {participation.name && (
                  <DisplayField
                    alwaysShow
                    label='Name'
                    content={participation.name}
                  />
                )}
                {participation.website && (
                  <DisplayField
                    label='Website'
                    alwaysShow
                    content={
                      <Link
                        href={participation.website}
                        target='_blank'
                        rel='noopener noreferrer'
                        style={{ color: theme.palette.text.primary }}
                      >
                        {participation.website}
                      </Link>
                    }
                  />
                )}
                <DividerWithMargin />
                <DisplayField
                  alwaysShow
                  label='email'
                  content={
                    participation.email ? (
                      <DontBreakOutLink
                        href={`mailto:${participation.email}`}
                        style={{ color: theme.palette.text.primary }}
                      >
                        {participation.email}
                      </DontBreakOutLink>
                    ) : (
                      '__'
                    )
                  }
                />
                <DisplayField
                  label='Phone Number'
                  alwaysShow
                  content={participation.phone}
                />
                <DisplayField label='Notes' content={participation.notes} />
              </CardContent>
              <CardActions>
                <Button onClick={handleClick}>BACK TO DETAILS</Button>
              </CardActions>
            </>
          ) : (
            <CardContent>
              <DisplayField
                label={`Trial ${sponsorPlural}`}
                content={sponsorNames}
              />
              <DisplayField
                onlyMobile
                label='Trial Sponsor'
                content={firstSponsor}
              />
              <DisplayField label='Product' content={preferredName} />
              <DividerWithMargin />
              <DisplayField label='Phase' content={phase} alwaysShow />
              <DisplayField
                // alwaysShow
                label='Accepts Healthy Volunteers?'
                content={
                  acceptsHealthySubjects === 'Yes' ? (
                    <Box
                      color='success.main'
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <CheckCircleIcon />
                      Yes
                    </Box>
                  ) : (
                    'No'
                  )
                }
              />
              <DisplayField
                label='Trial Registry Link'
                alwaysShow
                content={
                  registryLink ? (
                    <Link
                      href={registryLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      style={{ color: theme.palette.text.primary }}
                    >
                      Click Here
                    </Link>
                  ) : (
                    '__'
                  )
                }
              />
              <CardActions>
                <Button
                  onClick={handleClick}
                  variant='contained'
                  color='secondary'
                >
                  HOW TO VOLUNTEER
                </Button>
              </CardActions>
            </CardContent>
          )}
        </Card>
      </StyledPopup>
    )
  }
  return null
}

PopUpDisplay.propTypes = {
  popupInfo: PropTypes.shape({
    chemicalName: PropTypes.string,
    currentStatus: PropTypes.string,
    sponsors: PropTypes.arrayOf(
      PropTypes.shape({ sponsorName: PropTypes.string })
    ),
    trialId: PropTypes.string,
    status: PropTypes.string,
    brandName: PropTypes.string,
    clickedLocation: PropTypes.shape({
      lng: PropTypes.number,
      lat: PropTypes.number,
      name: PropTypes.string,
    }),
    phase: PropTypes.string,
    preferredName: PropTypes.string,
    indication: PropTypes.string,
    therapeuticApproach: PropTypes.string,
    repurposed: PropTypes.string,
    acceptsHealthySubjects: PropTypes.string,
    registryLink: PropTypes.string,
    contact: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  onClose: PropTypes.func,
}

PopUpDisplay.defaultProps = {
  popupInfo: null,
  onClose: null,
}

export default PopUpDisplay
