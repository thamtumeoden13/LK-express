import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    formContainer: {
        flexDirection: 'row',
        height: 80,
        marginTop: 40,
        marginBottom: 20,
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingLeft: 16,
        flex: 1,
        marginRight: 5
    },
    button: {
        height: 47,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 80,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    listContainer: {
        marginTop: 20,
        padding: 20,
    },
    entityContainer: {
        marginTop: 16,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingBottom: 16
    },
    entityText: {
        fontSize: 20,
        color: '#333333'
    },
    footer: {
        height: 100,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btnLeft: {
        width: 30,
        height: 30,
        backgroundColor: '#f0f0f0',
        borderRadius: 100,
    },
    input: {
        width: '100%',
        minHeight: 50,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    scrollview: {
        width: '100%',
        padding: 12,
    },
    btn: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#fe8a71',
        paddingHorizontal: 10,
        borderRadius: 5,
        elevation: 5,
        shadowColor: 'black',
        shadowOffset: { width: 0.3 * 4, height: 0.5 * 4 },
        shadowOpacity: 0.2,
        shadowRadius: 0.7 * 4,
    },
    safeareview: {
        justifyContent: 'center',
        flex: 1,
    },
    btnTitle: {
        color: 'white',
        fontWeight: 'bold',
    },
})