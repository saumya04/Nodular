var CustomValidator = require('../validators/CustomValidator');
/**
 * self calling function to register the custom validators into the package ValidatorJS
 * @return void
 */
(function() {

  CustomValidator.init('unique', 'validateUnique', true);
  CustomValidator.init('exist', 'validateIsExist', true);
  CustomValidator.init('exist_in', 'validateExistIn', true);
  CustomValidator.init('not_exist', 'validateNotExist', true);
  CustomValidator.init('gt', 'validateGreaterThan');
  CustomValidator.init('gte', 'validateGreaterThanEqual');
  CustomValidator.init('lt', 'validateLessThan');
  CustomValidator.init('lte', 'validateLessThanEqual');
  CustomValidator.init('mimeTypes', 'validateMimetypes');
  CustomValidator.init('imageSize', 'validateImageSize');
  CustomValidator.init('fileSize', 'validateFileSize');
  CustomValidator.init('dimensions', 'validateImageDimension', true);
  CustomValidator.init('youtube_url', 'validateYoutubeUrl');
  CustomValidator.init('datetime', 'validateDateTime');
  CustomValidator.init('json', 'validateJson');
  CustomValidator.init('json_format', 'validateJsonFormat', true);
  CustomValidator.init('student_program_document_sessions', 'validateStudentProgramDocumentSessions');
  CustomValidator.init('in_bool', 'validateInBool');
  
})();
