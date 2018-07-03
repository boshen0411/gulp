import processor from 'process'

export default function(type) {

    var srcPath
    var distPath
    var images1719ComRealPath

    srcPath = `${processor.cwd()}/src`
    distPath = `${processor.cwd()}/dist`
    images1719ComRealPath = `${processor.cwd()}/dist`
    
    return {
        path: {
            projectPath: processor.cwd(),
            srcPath,
            htmlPath: `${srcPath}/html`,
            jsPath: `${srcPath}/js`,
            lessPath: `${srcPath}/less`,
            lessMobPath: `${srcPath}/less-mob`,
            lessIE8Path: `${srcPath}/less-ie8`,
            libPath: `${srcPath}/lib`,
            componentPath: `${srcPath}/component`,
            contentPath: `${processor.cwd()}/content`,
            distPath,
            images1719ComRealPath: distPath,
            images1719ComDomainPath: '',
        },
    }
}
