import React from 'react'
import PropTypes from 'prop-types'
import Tile from '../components/Tile/Tile'
import Details from '../sections/Details/Details'
import MapAndMilestones from '../sections/MapAndMilestones'
import * as S from '../styles'
import FilterDropdown from 'components/FilterDropdown/FilterDropdown'
import FilterSelector from './FilterSelector'

const Treatments = ({ treatments }) => {
  return (
    <FilterSelector
      assets={treatments}
      render={({
        uniqueNames,
        uniqueSponsors,
        handleSelectedName,
        handleSelectedId,
        handleSelectedSponsor,
        filteredVacs,
        filtersSelected,
        selectedAsset,
      }) => (
        <>
          <S.Flex1>
            <Tile header='Total Treatment Products'>
              {treatments.length || '...'}
            </Tile>
            <Tile>
              <FilterDropdown
                filters={uniqueSponsors}
                selected={filtersSelected.s}
                handleSelected={handleSelectedSponsor}
              />
              <FilterDropdown
                label='name'
                filters={uniqueNames}
                selected={filtersSelected.n}
                handleSelected={handleSelectedName}
              />
            </Tile>
          </S.Flex1>
          <S.TabbedSection>
            <MapAndMilestones
              pins={filteredVacs}
              title='Treatment Map'
              handleSelectedId={handleSelectedId}
            />
          </S.TabbedSection>
          <S.RightColumn>
            <Details selectedAsset={selectedAsset} />
          </S.RightColumn>
        </>
      )}
    />
  )
}

Treatments.propTypes = {
  treatments: PropTypes.arrayOf(PropTypes.shape({})),
}

Treatments.defaultProps = {
  treatments: [],
}

export default Treatments