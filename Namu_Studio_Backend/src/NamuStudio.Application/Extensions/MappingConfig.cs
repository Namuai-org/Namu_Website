using Mapster;
using NamuStudio.Application.DTOs.Code;
using NamuStudio.Application.DTOs.Outputs;
using NamuStudio.Application.DTOs.Sessions;
using NamuStudio.Application.DTOs.Users;
using NamuStudio.Core.Entities;

namespace NamuStudio.Application.Extensions;

public static class MappingConfig
{
    public static TypeAdapterConfig RegisterMappings(this TypeAdapterConfig config)
    {
        config.NewConfig<User, UserDto>();
        config.NewConfig<Message, MessageDto>();
        config.NewConfig<CreateOutput, CreateOutputDto>();
        config.NewConfig<CodeFile, CodeFileDto>();
        config.NewConfig<CodeProject, CodeProjectDto>();
        config.NewConfig<Session, SessionDto>()
            .Map(dest => dest.MessageCount, src => src.Messages.Count);
        return config;
    }
}
