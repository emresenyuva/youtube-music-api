const _ = require('lodash')
const utils = require('./utils')

exports.parseSearchResult = (context) => {
    const result = {
        content: []
    }

    var sectionList = utils.fv(
        context, 'musicResponsiveListItemRenderer'
    )
    if (!Array.isArray(sectionList)) {
        sectionList = [sectionList]
    }
    sectionList.forEach(sectionContext => {
        const flexColumn = _.concat(utils.fv(
            sectionContext, 'musicResponsiveListItemFlexColumnRenderer'
        ))
        const type = _.nth(utils.fv(_.nth(flexColumn, 1), 'runs:text'), 0)
        switch (type) {
            case 'Song':
                result.content.push(Object.freeze({
                    type: _.lowerCase(_.nth(utils.fv(_.nth(flexColumn, 1), 'runs:text'), 0)),
                    videoId: utils.fv(sectionContext, 'playNavigationEndpoint:videoId'),
                    playlistId: utils.fv(sectionContext, 'playNavigationEndpoint:playlistId'),
                    name: utils.fv(_.nth(flexColumn, 0), 'runs:text'),
                    artist: (function() {
                        var a = [],
                            c = (_.nth(utils.fv(_.nth(flexColumn, 1), 'runs'), 2))
                        if (Array.isArray(c)) {
                            c = _.filter(c, function(o) {
                                return o.navigationEndpoint
                            })
                            for (var i = 0; i < c.length; i++) {
                                a.push({
                                    name: utils.fv(c[i], 'text'),
                                    browseId: utils.fv(c[i], 'browseEndpoint:browseId')
                                })
                            }
                        } else {
                            a.push({
                                name: utils.fv(c, 'text'),
                                browseId: utils.fv(c, 'browseEndpoint:browseId')
                            })
                        }
                        return 1 < a.length ? a : 0 < a.length ? a[0] : a
                    })(),
                    album: (function() {
                        var c = (_.nth(utils.fv(_.nth(flexColumn, 1), 'runs'), 4))
                        if (!Array.isArray(c) && c instanceof Object) return {
                            name: utils.fv(c, 'text'),
                            browseId: utils.fv(c, 'browseEndpoint:browseId')
                        }
                        return {}
                    })(),
                    duration: utils.hms2ms(_.nth(utils.fv(_.nth(flexColumn, 1), 'runs:text'), 6)),
                    thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails'),
                    params: utils.fv(sectionContext, 'playNavigationEndpoint:params')
                }))
                break
            case 'Video':
                result.content.push(Object.freeze({
                    type: _.lowerCase(_.nth(utils.fv(_.nth(flexColumn, 1), 'runs:text'), 0)),
                    videoId: utils.fv(sectionContext, 'playNavigationEndpoint:videoId'),
                    playlistId: utils.fv(sectionContext, 'playNavigationEndpoint:playlistId'),
                    name: utils.fv(_.nth(flexColumn, 0), 'runs:text'),
                    author: _.nth(utils.fv(_.nth(flexColumn, 1), 'runs:text'), 2),
                    views: _.nth(utils.fv(_.nth(flexColumn, 1), 'runs:text'), 4),
                    duration: utils.hms2ms(_.nth(utils.fv(_.nth(flexColumn, 1), 'runs:text'), 6)),
                    thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails'),
                    params: utils.fv(sectionContext, 'playNavigationEndpoint:params'),
                }))
                break
            case 'Artist':
                result.content.push(Object.freeze({
                    type: _.lowerCase(_.nth(utils.fv(_.nth(flexColumn, 1), 'runs:text'), 0)),
                    browseId: utils.fv(_.at(sectionContext, 'navigationEndpoint'), 'browseEndpoint:browseId'),
                    name: utils.fv(_.nth(flexColumn, 0), 'runs:text'),
                    thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails')
                }))
                break
            case 'EP':
            case 'Single':
            case 'Album':
                result.content.push(Object.freeze({
                    type: _.lowerCase(_.nth(utils.fv(_.nth(flexColumn, 1), 'runs:text'), 0)),
                    browseId: utils.fv(
                        _.at(
                            sectionContext, 'navigationEndpoint'
                        ),
                        'browseEndpoint:browseId'
                    ),
                    playlistId: utils.fv(sectionContext, 'playNavigationEndpoint:playlistId'),
                    name: utils.fv(_.nth(flexColumn, 0), 'runs:text'),
                    artist: (_.nth(utils.fv(_.nth(flexColumn, 1), 'runs:text'), 2)),
                    year: _.nth(utils.fv(_.nth(flexColumn, 1), 'runs:text'), 4),
                    thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails')
                }))
                break
            case 'Playlist':
                result.content.push(Object.freeze({
                    type: _.lowerCase(utils.fv(_.nth(flexColumn, 1), 'runs:text')),
                    browseId: utils.fv(
                        _.at(
                            sectionContext, 'navigationEndpoint'
                        ),
                        'browseEndpoint:browseId'
                    ),
                    title: utils.fv(_.nth(flexColumn, 0), 'runs:text'),
                    author: _.nth(utils.fv(_.nth(flexColumn, 1), 'runs:text'), 3),
                    count: _.toNumber(
                        _.nth(
                            _.words(
                                _.nth(utils.fv(_.nth(flexColumn, 1), 'runs:text'), 5)
                            ),
                            0
                        )
                    ),
                    thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails')
                }))
                break
            default:
                break
        }
    })
    return result
}

exports.parseSongSearchResult = (context) => {
    const result = {
        content: [],
        continuation: utils.fv(
            context, 'nextContinuationData', true
        )
    }

    var sectionList = utils.fv(
        context, 'musicResponsiveListItemRenderer', true
    )

    if (!Array.isArray(sectionList)) {
        sectionList = [sectionList]
    }
    sectionList.forEach(sectionContext => {
        const flexColumn = utils.fv(
            sectionContext, 'musicResponsiveListItemFlexColumnRenderer', true
        )
        result.content.push({
            type: 'song',
            videoId: utils.fv(sectionContext, 'playNavigationEndpoint:videoId', true),
            playlistId: utils.fv(sectionContext, 'playNavigationEndpoint:playlistId'),
            name: utils.fv(flexColumn[0], 'runs:text', true),
            artist: (function() {
                var a = [],
                    c = (utils.fv(flexColumn[1], 'runs'))
                if (Array.isArray(c)) {
                    c = _.filter(c, function(o) {
                        return o.navigationEndpoint
                    })
                    for (var i = 0; i < c.length; i++) {
                        let browseId = utils.fv(c[i], 'browseEndpoint:browseId', true)
                        if (browseId.startsWith('UC')) {
                          a.push({
                              name: utils.fv(c[i], 'text', true),
                              browseId
                          })
                        }
                    }
                } else {
                  let browseId = utils.fv(c, 'browseEndpoint:browseId', true)
                  if (browseId.startsWith('UC')) {
                    a.push({
                        name: utils.fv(c, 'text', true),
                        browseId
                    })
                  }
                }
                return 1 < a.length ? a : 0 < a.length ? a[0] : a
            })(),
            album: (function() {
                var c = _.first(utils.fv(flexColumn[1], 'runs', true))
                if (!Array.isArray(c) && c instanceof Object) return {
                    name: utils.fv(c, 'text'),
                    browseId: utils.fv(c, 'browseEndpoint:browseId', true)
                }
                return {}
            })(),
            duration: utils.hms2ms(_.last(utils.fv(flexColumn[1], 'runs:text', true))),
            thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails', true),
            params: utils.fv(sectionContext, 'playNavigationEndpoint:params')
        })

    })
    return result
}

exports.parseVideoSearchResult = (context) => {
    const result = {
        content: [],
        contination: utils.fv(
            context, 'nextContinuationData'
        )
    }

    var sectionList = utils.fv(
        context, 'musicResponsiveListItemRenderer'
    )
    if (!Array.isArray(sectionList)) {
        sectionList = [sectionList]
    }
    sectionList.forEach(sectionContext => {
        const flexColumn = _.concat(utils.fv(
            sectionContext, 'musicResponsiveListItemFlexColumnRenderer'
        ))
        result.content.push(Object.freeze({
            type: 'video',
            videoId: utils.fv(sectionContext, 'playNavigationEndpoint:videoId'),
            playlistId: utils.fv(sectionContext, 'playNavigationEndpoint:playlistId'),
            name: utils.fv(_.nth(flexColumn, 0), 'runs:text'),
            author: _.nth(utils.fv(_.nth(flexColumn, 1), 'runs:text'), 0),
            views: _.nth(utils.fv(_.nth(flexColumn, 1), 'runs:text'), 2),
            duration: utils.hms2ms(_.last(utils.fv(_.nth(flexColumn, 1), 'runs:text'))),
            thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails'),
            params: utils.fv(sectionContext, 'playNavigationEndpoint:params')
        }))
    })
    return result
}

exports.parseAlbumSearchResult = (context) => {
    const result = {
        content: [],
        contination: utils.fv(
            context, 'nextContinuationData'
        )
    }

    var sectionList = utils.fv(
        context, 'musicResponsiveListItemRenderer'
    )
    if (!Array.isArray(sectionList)) {
        sectionList = [sectionList]
    }
    sectionList.forEach(sectionContext => {
        const flexColumn = _.concat(utils.fv(
            sectionContext, 'musicResponsiveListItemFlexColumnRenderer'
        ))
        result.content.push(Object.freeze({
            type: _.lowerCase(_.first(utils.fv(_.nth(flexColumn, 1), 'runs:text'))),
            browseId: utils.fv(
                _.at(
                    sectionContext, 'navigationEndpoint'
                ),
                'browseEndpoint:browseId'
            ),
            playlistId: utils.fv(sectionContext, 'toggledServiceEndpoint:playlistId', true),
            name: utils.fv(_.nth(flexColumn, 0), 'runs:text'),
            artist: _.join(_.filter(utils.fv(_.nth(flexColumn, 1), 'runs:text').slice(1, -1), v => ' • ' != v && true), ''),
            year: _.last(utils.fv(_.nth(flexColumn, 1), 'runs:text')),
            thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails'),
        }))
    })
    return result
}

exports.parseArtistSearchResult = (context) => {
    const result = {
        content: [],
        contination: utils.fv(
            context, 'nextContinuationData'
        )
    }

    var sectionList = utils.fv(
        context, 'sectionListRenderer:musicResponsiveListItemRenderer'
    )
    if (!Array.isArray(sectionList)) {
        sectionList = [sectionList]
    }
    sectionList.forEach(sectionContext => {
        const flexColumn = _.concat(utils.fv(
            sectionContext, 'musicResponsiveListItemFlexColumnRenderer'
        ))
        result.content.push(Object.freeze({
            type: _.lowerCase(_.first(utils.fv(_.nth(flexColumn, 1), 'runs:text'))),
            browseId: utils.fv(_.at(sectionContext, 'navigationEndpoint'), 'browseEndpoint:browseId'),
            name: utils.fv(_.nth(flexColumn, 0), 'runs:text'),
            thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails')
        }))
    })
    return result
}

exports.parsePlaylistSearchResult = (context) => {
    const result = {
        content: [],
        contination: utils.fv(
            context, 'nextContinuationData'
        )
    }

    var sectionList = utils.fv(
        context, 'musicResponsiveListItemRenderer'
    )
    if (!Array.isArray(sectionList)) {
        sectionList = [sectionList]
    }
    sectionList.forEach(sectionContext => {
        const flexColumn = _.concat(utils.fv(
            sectionContext, 'musicResponsiveListItemFlexColumnRenderer'
        ))
        result.content.push(Object.freeze({
            type: 'playlist',
            browseId: utils.fv(
                _.at(
                    sectionContext, 'navigationEndpoint'
                ),
                'browseEndpoint:browseId'
            ),
            title: utils.fv(_.nth(flexColumn, 0), 'runs:text'),
            author: _.first(utils.fv(_.nth(flexColumn, 1), 'runs:text')),
            trackCount: _.toNumber(
                _.nth(
                    _.words(
                        _.last(utils.fv(_.nth(flexColumn, 1), 'runs:text'))
                    ),
                    0
                )
            ),
            thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails')
        }))
    })
    return result
}

exports.parseArtistPage = context => {
    const result = {
        name: '',
        description: '',
        views: '',
        products: {},
        thumbnails: []
    }

    const headerContext = utils.fv(
        context, 'musicImmersiveHeaderRenderer'
    )
    result.name = utils.fv(_.at(headerContext, 'title'), 'text')
    result.thumbnails = utils.fv(_.at(headerContext, 'thumbnail'), 'musicThumbnailRenderer:thumbnails')

    const descriptionContext = utils.fv(
        context, 'musicDescriptionShelfRenderer'
    )
    if (!Array.isArray(descriptionContext)) {
        result.description = utils.fv(_.at(descriptionContext, 'description'), 'text')
        result.views = _.parseInt(
            _.replace(
                _.nth(
                    _.split(utils.fv(
                            _.at(descriptionContext, 'subheader'),
                            'text'
                        ),
                        ' '
                    ),
                    0
                ),
                /,/g, ''
            ))
    }

    const nextMusicNavigation = utils.fv(context, 'musicShelfRenderer:bottomEndpoint:browseEndpoint')
    if (!Array.isArray(nextMusicNavigation)) {
        result.products.songs = {
            content: [],
            browseId: nextMusicNavigation.browseId,
            params: nextMusicNavigation.params,
        }
    } else {
        result.products.songs = {
            content: []
        }
    }
    utils.fv(context, 'musicShelfRenderer:musicResponsiveListItemRenderer').forEach(itemContext => {
        const flexColumn = _.concat(utils.fv(
            itemContext, 'musicResponsiveListItemFlexColumnRenderer'
        ))
        result.products.songs.content.push({
            name: utils.fv(_.nth(flexColumn, 0), 'runs:text'),
            album: (function() {
                var c = (utils.fv(_.nth(flexColumn, 2), 'runs'))
                if (!Array.isArray(c) && c instanceof Object) return {
                    name: utils.fv(c, 'text'),
                    browseId: utils.fv(c, 'browseEndpoint:browseId')
                }
                return {}
            })(),
            artist: (function() {
                var a = [],
                    c = (utils.fv(_.nth(flexColumn, 1), 'runs'))
                if (Array.isArray(c)) {
                    c = _.filter(c, function(o) {
                        return o.navigationEndpoint
                    })
                    for (var i = 0; i < c.length; i++) {
                        a.push({
                            name: utils.fv(c[i], 'text'),
                            browseId: utils.fv(c[i], 'browseEndpoint:browseId')
                        })
                    }
                } else {
                    a.push({
                        name: utils.fv(c, 'text'),
                        browseId: utils.fv(c, 'browseEndpoint:browseId')
                    })
                }
                return 1 < a.length ? a : 0 < a.length ? a[0] : a
            })()
        })
    })
    utils.fv(context, 'musicCarouselShelfRenderer').forEach(carouselContext => {
        const carouselName = _.lowerCase(utils.fv(carouselContext, 'musicCarouselShelfBasicHeaderRenderer:title:text'))

        if (['albums', 'singles', 'videos'].includes(carouselName)) {
            const nextCarouselNavigation = utils.fv(carouselContext, 'musicCarouselShelfBasicHeaderRenderer:title:navigationEndpoint:browseEndpoint')
            if (!Array.isArray(nextCarouselNavigation)) {
                result.products[carouselName] = {
                    content: [],
                    browseId: nextCarouselNavigation.browseId,
                    params: nextCarouselNavigation.params,
                }
            } else {
                result.products[carouselName] = {
                    content: []
                }
            }

            const itemContext = utils.fv(carouselContext, 'musicTwoRowItemRenderer')
            if (Array.isArray(itemContext)) {
                for (let i = 0; i < itemContext.length; i++) {
                    switch (carouselName) {
                        case 'singles':
                            result.products[carouselName].content.push({
                                type: 'single',
                                browseId: utils.fv(_.at(itemContext[i], 'navigationEndpoint'), 'browseEndpoint:browseId'),
                                name: utils.fv(_.at(itemContext[i], 'title'), 'text'),
                                year: utils.fv(_.at(itemContext[i], 'subtitle'), 'text'),
                                thumbnails: utils.fv(itemContext[i], 'musicThumbnailRenderer:thumbnails')
                            })
                            break
                        case 'albums':
                            result.products[carouselName].content.push({
                                type: _.nth(utils.fv(_.at(itemContext[i], 'subtitle'), 'text'), 0),
                                browseId: utils.fv(_.at(itemContext[i], 'navigationEndpoint'), 'browseEndpoint:browseId'),
                                name: utils.fv(_.at(itemContext[i], 'title'), 'text'),
                                year: _.nth(utils.fv(_.at(itemContext[i], 'subtitle'), 'text'), 2),
                                thumbnails: utils.fv(itemContext[i], 'musicThumbnailRenderer:thumbnails')
                            })
                            break
                        case 'videos':
                            result.products[carouselName].content.push({
                                type: 'video',
                                videoId: utils.fv(_.at(itemContext[i], 'title'), 'watchEndpoint:videoId'),
                                playlistId: utils.fv(_.at(itemContext[i], 'title'), 'watchEndpoint:playlistId'),
                                name: utils.fv(_.at(itemContext[i], 'title'), 'text'),
                                author: _.join(_.dropRight(utils.fv(_.at(itemContext[i], 'subtitle'), 'text'), 2), ''),
                                views: _.nth(utils.fv(_.at(itemContext[i], 'subtitle'), 'text'), 2),
                                thumbnails: utils.fv(itemContext[i], 'musicThumbnailRenderer:thumbnails')
                            })
                            break
                    }
                }
            } else if (itemContext instanceof Object) {
                switch (carouselName) {
                    case 'singles':
                        result.products[carouselName].content.push({
                            type: 'single',
                            browseId: utils.fv(_.at(itemContext, 'navigationEndpoint'), 'browseEndpoint:browseId'),
                            name: utils.fv(_.at(itemContext, 'title'), 'text'),
                            year: utils.fv(_.at(itemContext, 'subtitle'), 'text'),
                            thumbnails: utils.fv(itemContext, 'musicThumbnailRenderer:thumbnails')
                        })
                        break
                    case 'albums':
                        result.products[carouselName].content.push({
                            type: _.nth(utils.fv(_.at(itemContext, 'subtitle'), 'text'), 0),
                            browseId: utils.fv(_.at(itemContext, 'navigationEndpoint'), 'browseEndpoint:browseId'),
                            name: utils.fv(_.at(itemContext, 'title'), 'text'),
                            year: _.nth(utils.fv(_.at(itemContext, 'subtitle'), 'text'), 2),
                            thumbnails: utils.fv(itemContext, 'musicThumbnailRenderer:thumbnails')
                        })
                        break
                    case 'videos':
                        result.products[carouselName].content.push({
                            type: 'video',
                            videoId: utils.fv(_.at(itemContext, 'title'), 'watchEndpoint:videoId'),
                            playlistId: utils.fv(_.at(itemContext, 'title'), 'watchEndpoint:playlistId'),
                            name: utils.fv(_.at(itemContext, 'title'), 'text'),
                            author: _.join(_.dropRight(utils.fv(_.at(itemContext, 'subtitle'), 'text'), 2), ''),
                            views: _.nth(utils.fv(_.at(itemContext, 'subtitle'), 'text'), 2),
                            thumbnails: utils.fv(itemContext, 'musicThumbnailRenderer:thumbnails')
                        })
                        break
                }
            }
        }
    })
    return result
}

exports.parsePlaylistPage = context => {
    const result = {
        title: '',
        owner: '',
        trackCount: 0,
        dateYear: '',
        content: [],
        thumbnails: [],
        continuation: utils.fv(
            context, 'nextContinuationData', true
        )
    }

    if (!_.has(context, 'continuationContents')) {
        const pageHeader = utils.fv(
            context, 'musicDetailHeaderRenderer'
        )
        result.title = utils.fv(_.at(pageHeader, 'title'), 'runs:text')
        result.owner = _.nth(utils.fv(_.at(pageHeader, 'subtitle'), 'runs:text'), 2)
        result.trackCount = parseInt(_.words(_.nth(utils.fv(_.at(pageHeader, 'secondSubtitle'), 'runs:text'), 0)))
        result.dateYear = _.nth(utils.fv(_.at(pageHeader, 'subtitle'), 'runs:text'), 4)
        result.thumbnails = utils.fv(pageHeader, 'croppedSquareThumbnailRenderer:thumbnails')
    }

    const itemContext = utils.fv(
        context, 'musicResponsiveListItemRenderer'
    )
    if (Array.isArray(itemContext)) {
        for (let i = 0; i < itemContext.length; i++) {
            const flexColumn = utils.fv(
                itemContext[i], 'musicResponsiveListItemFlexColumnRenderer', true
            )
            result.content.push({
                videoId: utils.fv(itemContext[i], 'playNavigationEndpoint:videoId'),
                name: utils.fv(_.nth(flexColumn, 0), 'runs:text'),
                author: (function() {
                    var a = [],
                        c = (utils.fv(_.nth(flexColumn, 1), 'runs'))
                    if (Array.isArray(c)) {
                        c = _.filter(c, function(o) {
                            return o.navigationEndpoint
                        })
                        for (var i = 0; i < c.length; i++) {
                            a.push({
                                name: utils.fv(c[i], 'text'),
                                browseId: utils.fv(c[i], 'browseEndpoint:browseId')
                            })
                        }
                    } else {
                        a.push({
                            name: utils.fv(c, 'text'),
                            browseId: utils.fv(c, 'browseEndpoint:browseId')
                        })
                    }
                    return 1 < a.length ? a : 0 < a.length ? a[0] : a
                })(),
                duration: utils.hms2ms(utils.fv(itemContext[i], 'musicResponsiveListItemFixedColumnRenderer:runs:text', true)),
                thumbnails: utils.fv(itemContext[i], 'musicThumbnailRenderer:thumbnails')
            })
        }
    } else {
        const flexColumn = utils.fv(
            itemContext, 'musicResponsiveListItemFlexColumnRenderer', true
        )
        result.content.push({
            videoId: utils.fv(itemContext, 'playNavigationEndpoint:videoId'),
            name: utils.fv(_.nth(flexColumn, 0), 'runs:text'),
            author: (function() {
                var a = [],
                    c = (utils.fv(_.nth(flexColumn, 1), 'runs'))
                if (Array.isArray(c)) {
                    c = _.filter(c, function(o) {
                        return o.navigationEndpoint
                    })
                    for (var i = 0; i < c.length; i++) {
                        a.push({
                            name: utils.fv(c[i], 'text'),
                            browseId: utils.fv(c[i], 'browseEndpoint:browseId')
                        })
                    }
                } else {
                    a.push({
                        name: utils.fv(c, 'text'),
                        browseId: utils.fv(c, 'browseEndpoint:browseId')
                    })
                }
                return 1 < a.length ? a : 0 < a.length ? a[0] : a
            })(),
            duration: utils.hms2ms(utils.fv(itemContext, 'musicResponsiveListItemFixedColumnRenderer:runs:text', true)),
            thumbnails: utils.fv(itemContext, 'musicThumbnailRenderer:thumbnails', true)
        })
    }
    return result
}

exports.parseAlbumPage = context => {
    const result = {
        title: '',
        description: '',
        trackCount: 0,
        date: {
            year: 0,
            month: 0,
            day: 0
        },
        duration: 0,
        artist: [],
        tracks: [],
        thumbnails: []
    }

    const albumRelease = utils.fv(
        context, 'musicAlbumRelease'
    )
    result.title = albumRelease.title
    result.trackCount = parseInt(albumRelease.trackCount)
    result.date = albumRelease.releaseDate
    result.duration = parseInt(albumRelease.durationMs)
    result.playlistId = albumRelease.audioPlaylistId
    result.thumbnails = utils.fv(albumRelease, 'thumbnailDetails:thumbnails')

    const albumReleaseDetail = utils.fv(
        context, 'musicAlbumReleaseDetail'
    )
    result.description = albumReleaseDetail.description

    const albumArtist = utils.fv(
        context, 'musicArtist'
    )
    if (albumArtist instanceof Array) {
        for (let i = 0; i < albumArtist.length; i++) {
            result.artist.push({
                name: albumArtist[i].name,
                browseId: albumArtist[i].externalChannelId,
                thumbnails: utils.fv(albumArtist[i], 'thumbnailDetails:thumbnails')
            })
        }
    } else if (albumArtist instanceof Object) {
        result.artist.push({
            name: albumArtist.name,
            browseId: albumArtist.externalChannelId,
            thumbnails: utils.fv(albumArtist, 'thumbnailDetails:thumbnails')
        })
    }

    const albumTrack = utils.fv(
        context, 'musicTrack'
    )
    if (albumTrack instanceof Array) {
        for (let i = 0; i < albumTrack.length; i++) {
            result.tracks.push({
                name: albumTrack[i].title,
                videoId: albumTrack[i].videoId,
                artistNames: albumTrack[i].artistNames,
                duration: parseInt(albumTrack[i].lengthMs),
                thumbnails: utils.fv(albumTrack[i], 'thumbnailDetails:thumbnails')
            })
        }
    } else if (albumTrack instanceof Object) {
        result.tracks.push({
            name: albumTrack.title,
            videoId: albumTrack.videoId,
            artistNames: albumTrack.artistNames,
            duration: parseInt(albumTrack.lengthMs),
            thumbnails: utils.fv(albumTrack, 'thumbnailDetails:thumbnails')
        })
    }
    return result
}

exports.parseNextPanel = context => {
    const result = {
        title: '',
        playlistId: '',
        content: [],
        currentIndex: 0,
        contination: utils.fv(
            context, 'nextContinuationData'
        )
    }

    const panelContext = utils.fv(context, "playlistPanelRenderer")
    result.title = panelContext.title
    result.playlistId = panelContext.playlistId
    result.currentIndex = panelContext.currentIndex

    utils.fv(panelContext, 'playlistPanelVideoRenderer').forEach(itemContext => {
        result.content.push({
            index: _.nth(_.at(itemContext, 'navigationEndpoint.watchEndpoint.index'), 0),
            selected: _.nth(_.at(itemContext, 'selected'), 0),
            videoId: _.nth(_.at(itemContext, 'videoId'), 0),
            playlistId: _.nth(_.at(itemContext, 'navigationEndpoint.watchEndpoint.playlistId'), 0),
            params: _.nth(_.at(itemContext, 'navigationEndpoint.watchEndpoint.params'), 0)
        })
    })
    return result

}
