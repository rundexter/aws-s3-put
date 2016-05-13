var _ = require( 'lodash' );
var aws = require( 'aws-sdk' );

module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var aws_id          = dexter.environment( 'aws_access_key_id' );
        var aws_secret      = dexter.environment( 'aws_secret_key' );

        var bucket          = step.input( 'bucket' ).first();
        var key             = step.input( 'key' ).first();
        var acl             = step.input( 'acl' ).first();
        var data            = step.input( 'data' ).first();
        var content_type    = step.input( 'content_type' ).first();

        aws.config.update( { accessKeyId: aws_id, secretAccessKey: aws_secret } );

        var s3 = new aws.S3();
        var self = this;

        var params = {
            Bucket: bucket,
            Key: key,
            ACL: acl,
            Body: data,
            ContentType: content_type,
        };

        s3.putObject( params, function( err, data ) {
            if ( err ) { return self.fail( err ) }
            else       { return self.complete( data ) }
        } );
    }
}
