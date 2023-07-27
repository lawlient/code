#include "mysql.h"

#include <butil/logging.h>

#include <sstream>


using namespace google::protobuf;


int MysqlWrapper::InsertRaw(const google::protobuf::Message &raw) {
    if (!connected()) {
        LOG(ERROR) << "connection is not valid";
        return 0;
    }

    const auto* desc = raw.GetDescriptor();
    const auto* refl = raw.GetReflection();

    std::stringstream cmd;
    cmd << "INSERT into " << desc->name() << " ";
    int i = 0;
    const auto* field = desc->field(i++);
    cmd << "(`" << field->name() << "`";
    for (; i < desc->field_count(); i++) {
        field = desc->field(i);
        cmd << ", `" << field->name() << "`";
    }
    cmd << ") VALUES (";

    i = 0; 
    field = desc->field(i++);
    switch (field->type()) {
        case FieldDescriptor::Type::TYPE_DOUBLE: { cmd << refl->GetDouble(raw, field); break; }
        case FieldDescriptor::Type::TYPE_FLOAT: { cmd << refl->GetFloat(raw, field); break; }
        case FieldDescriptor::Type::TYPE_INT64: { cmd << refl->GetInt64(raw, field); break; }
        case FieldDescriptor::Type::TYPE_UINT64: { cmd << refl->GetUInt64(raw, field); break; }
        case FieldDescriptor::Type::TYPE_INT32: { cmd << refl->GetInt32(raw, field); break; }
        case FieldDescriptor::Type::TYPE_FIXED64: { cmd << refl->GetUInt64(raw, field); break; }
        case FieldDescriptor::Type::TYPE_FIXED32: { cmd << refl->GetUInt32(raw, field); break; }
        case FieldDescriptor::Type::TYPE_STRING: { cmd << "\"" << refl->GetString(raw, field) << "\""; break; }
        default: break;
    }
    for (; i < desc->field_count(); i++) {
        field = desc->field(i);
        cmd << ", ";
        switch (field->type()) {
            case FieldDescriptor::Type::TYPE_DOUBLE: { cmd << refl->GetDouble(raw, field); break; }
            case FieldDescriptor::Type::TYPE_FLOAT: { cmd << refl->GetFloat(raw, field); break; }
            case FieldDescriptor::Type::TYPE_INT64: { cmd << refl->GetInt64(raw, field); break; }
            case FieldDescriptor::Type::TYPE_UINT64: { cmd << refl->GetUInt64(raw, field); break; }
            case FieldDescriptor::Type::TYPE_INT32: { cmd << refl->GetInt32(raw, field); break; }
            case FieldDescriptor::Type::TYPE_FIXED64: { cmd << refl->GetUInt64(raw, field); break; }
            case FieldDescriptor::Type::TYPE_FIXED32: { cmd << refl->GetUInt32(raw, field); break; }
            case FieldDescriptor::Type::TYPE_STRING: { cmd << "\"" << refl->GetString(raw, field) << "\""; break; }
            default: break;
        }
    }
    cmd << ")";
    LOG(INFO) << cmd.str();

    return execute(cmd.str());
}




