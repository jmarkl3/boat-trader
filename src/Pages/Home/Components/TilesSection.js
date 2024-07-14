import React from 'react'

function TilesSection({title = "Title Section Title", tiles = [{},{},{},{},], tyleType = "tile"}) {
    
    return (
        <div className='homePageSection'>
            <div className='tilesSection'>
                <div className='homePageSectionTitle'>{title}</div>
                {tiles.map(tileData => (
                    <div className={tyleType}>
                        
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TilesSection